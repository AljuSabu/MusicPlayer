import type {
  Track,
  Artist,
  Album,
  PlaylistResult,
  JamendoResponse,
} from "@/types/music";
import { artistImageUrl } from "@/lib/library";

const BASE_URL = "https://api.jamendo.com/v3.0";

// No caching while developing, 1 hour in production
const REVALIDATE_SECONDS = process.env.NODE_ENV === "production" ? 3600 : 0;

type Params = Record<string, string | number>;

type RequestOptions = { noStore?: boolean };

async function jamendoRequest<T>(
  endpoint: string,
  params: Params = {},
  options: RequestOptions = {},
): Promise<T[]> {
  const clientId = process.env.JAMENDO_CLIENT_ID?.trim();
  if (!clientId)
    throw new Error("Missing JAMENDO_CLIENT_ID in environment variables");

  const query = new URLSearchParams({
    client_id: clientId,
    format: "json",
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ),
  });

  const res = await fetch(
    `${BASE_URL}/${endpoint}/?${query}`,
    options.noStore
      ? { cache: "no-store" }
      : { next: { revalidate: REVALIDATE_SECONDS } },
  );
  if (!res.ok) throw new Error(`Jamendo request failed: ${res.status}`);

  const data: JamendoResponse<T> = await res.json();
  if (data.headers.status !== "success") {
    throw new Error(data.headers.error_message || "Jamendo API error");
  }
  return data.results;
}

async function fetchTracks(
  params: Params,
  options?: RequestOptions,
): Promise<Track[]> {
  const results = await jamendoRequest<Track>(
    "tracks",
    {
      imagesize: "300",
      audioformat: "mp32",
      type: "single albumtrack",
      ...params,
    },
    options,
  );
  // Keep only the fields to use
  return results.map((t) => ({
    id: t.id,
    name: t.name,
    duration: t.duration,
    artist_id: t.artist_id,
    artist_name: t.artist_name,
    album_id: t.album_id,
    album_name: t.album_name,
    image: t.image,
    audio: t.audio,
    license_ccurl: t.license_ccurl,
    shareurl: t.shareurl,
  }));
}

/* ---------- Tracks ---------- */

export async function getFeaturedTracks(limit = 12): Promise<Track[]> {
  // Jamendo's `featured=1` set comes back empty when requested from the production
  // server, so the highlights use a different ranking (buzzrate) instead.
  const buzzing = await fetchTracks({
    order: "buzzrate",
    groupby: "artist_id",
    limit,
  }).catch(() => [] as Track[]);

  if (buzzing.length > 0) return buzzing;

  // Last resort so the top of Home is never empty
  return fetchTracks({ order: "popularity_week", groupby: "artist_id", limit });
}

export function getTrendingTracks(limit = 10) {
  return fetchTracks({ order: "popularity_week", groupby: "artist_id", limit });
}

export function getNewReleases(limit = 10) {
  return fetchTracks({
    order: "releasedate_desc",
    groupby: "artist_id",
    limit,
  });
}

export function getTracksByGenre(genre: string, limit = 10) {
  return fetchTracks({ tags: genre, order: "popularity_total", limit });
}

export function searchTracks(query: string, limit = 20) {
  return fetchTracks({ search: query, limit });
}

export function getTracksByIds(ids: string[]) {
  if (ids.length === 0) return Promise.resolve([] as Track[]);
  // No server cache: these lists are per-user and a cached bad response would stick around
  return fetchTracks(
    { id: ids.join(" "), limit: Math.min(ids.length, 200) },
    { noStore: true },
  );
}

/* ---------- Artists, albums, playlists ---------- */

export async function searchArtists(
  query: string,
  limit = 5,
): Promise<Artist[]> {
  const results = await jamendoRequest<Artist>("artists", {
    namesearch: query,
    hasimage: 1,
    limit,
  });
  return results.map((a) => ({
    id: a.id,
    name: a.name,
    image: a.image,
    joindate: a.joindate,
  }));
}

export async function searchAlbums(query: string, limit = 4): Promise<Album[]> {
  const results = await jamendoRequest<Album>("albums", {
    namesearch: query,
    order: "popularity_total",
    imagesize: 300,
    limit,
  });
  return results.map((a) => ({
    id: a.id,
    name: a.name,
    releasedate: a.releasedate,
    artist_id: a.artist_id,
    artist_name: a.artist_name,
    image: a.image,
  }));
}

export async function searchPlaylists(
  query: string,
  limit = 4,
): Promise<PlaylistResult[]> {
  const results = await jamendoRequest<PlaylistResult>("playlists", {
    namesearch: query,
    limit,
  });
  return results.map((p) => ({
    id: p.id,
    name: p.name,
    user_name: p.user_name,
  }));
}

/* ---------- Album page ---------- */

type RawAlbumTrack = {
  id: string;
  position?: string;
  name: string;
  duration: string | number;
  audio?: string;
  license_ccurl?: string;
};

type RawAlbumWithTracks = Album & {
  shareurl?: string;
  tracks?: RawAlbumTrack[];
};

export type AlbumDetail = {
  album: Album;
  shareurl?: string;
  tracks: Track[];
};

export async function getAlbumWithTracks(
  id: string,
): Promise<AlbumDetail | null> {
  const results = await jamendoRequest<RawAlbumWithTracks>("albums/tracks", {
    id,
    imagesize: 300,
    audioformat: "mp32",
  });

  const raw = results[0];
  if (!raw) return null;

  // Tracks inside an album come back unordered, so sort by position
  const tracks: Track[] = (raw.tracks ?? [])
    .filter((t) => t.audio)
    .sort((a, b) => Number(a.position) - Number(b.position))
    .map((t) => ({
      id: t.id,
      name: t.name,
      duration: Number(t.duration),
      artist_id: raw.artist_id,
      artist_name: raw.artist_name,
      album_id: raw.id,
      album_name: raw.name,
      image: raw.image,
      audio: t.audio as string,
      license_ccurl: t.license_ccurl ?? "",
      shareurl: "",
    }));

  return {
    album: {
      id: raw.id,
      name: raw.name,
      releasedate: raw.releasedate,
      artist_id: raw.artist_id,
      artist_name: raw.artist_name,
      image: raw.image,
    },
    shareurl: raw.shareurl,
    tracks,
  };
}

export async function getArtistAlbums(
  artistId: string,
  limit = 8,
  options: { type?: "album" | "single"; order?: string } = {},
): Promise<Album[]> {
  const results = await jamendoRequest<Album>("albums", {
    artist_id: artistId,
    order: options.order ?? "popularity_total",
    imagesize: 300,
    limit,
    ...(options.type ? { type: options.type } : {}),
  });
  return results.map((a) => ({
    id: a.id,
    name: a.name,
    releasedate: a.releasedate,
    artist_id: a.artist_id,
    artist_name: a.artist_name,
    image: a.image,
  }));
}

/* ---------- Artist page ---------- */

type RawArtist = {
  id: string;
  name: string;
  website?: string;
  joindate?: string;
  shareurl?: string;
  musicinfo?: { description?: unknown; tags?: unknown };
};

export type ArtistProfile = {
  id: string;
  name: string;
  joindate?: string;
  website?: string;
  shareurl?: string;
  bio?: string; // plain text
  tags: string[];
};

// The description is HTML, possibly keyed by language. Reduce it to plain text.
function extractBio(description: unknown): string | undefined {
  let html: string | undefined;

  if (typeof description === "string") {
    html = description;
  } else if (description && typeof description === "object") {
    const byLanguage = description as Record<string, unknown>;
    const pick = byLanguage.en ?? Object.values(byLanguage)[0];
    if (typeof pick === "string") html = pick;
  }
  if (!html) return undefined;

  const text = html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

  return text || undefined;
}

export async function getArtistProfile(
  id: string,
): Promise<ArtistProfile | null> {
  const results = await jamendoRequest<RawArtist>("artists/musicinfo", { id });
  const raw = results[0];
  if (!raw) return null;

  const rawTags = raw.musicinfo?.tags;
  const tags = Array.isArray(rawTags)
    ? rawTags
        .filter(
          (t): t is string => typeof t === "string" && t.trim().length > 0,
        )
        .slice(0, 5)
    : [];

  return {
    id: raw.id,
    name: raw.name,
    joindate: raw.joindate,
    // The website is typed in by the artist, so only allow real web links
    website:
      raw.website && /^https?:\/\//i.test(raw.website)
        ? raw.website
        : undefined,
    shareurl: raw.shareurl,
    bio: extractBio(raw.musicinfo?.description),
    tags,
  };
}

export function getArtistPopularTracks(artistId: string, limit = 10) {
  return fetchTracks({ artist_id: artistId, order: "popularity_total", limit });
}

// "Similar" = other popular artists playing the same tag
export async function getSimilarArtists(
  tag: string,
  excludeId: string,
  limit = 5,
): Promise<Artist[]> {
  const tracks = await fetchTracks({
    tags: tag,
    order: "popularity_week",
    groupby: "artist_id",
    limit: limit + 6,
  });

  const seen = new Set<string>([excludeId]);
  const artists: Artist[] = [];
  for (const t of tracks) {
    if (seen.has(t.artist_id)) continue;
    seen.add(t.artist_id);
    artists.push({
      id: t.artist_id,
      name: t.artist_name,
      image: artistImageUrl(t.artist_id),
    });
    if (artists.length === limit) break;
  }
  return artists;
}
