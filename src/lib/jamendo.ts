import type {
  Track,
  Artist,
  Album,
  PlaylistResult,
  JamendoResponse,
} from "@/types/music";

const BASE_URL = "https://api.jamendo.com/v3.0";

type Params = Record<string, string | number>;

async function jamendoRequest<T>(
  endpoint: string,
  params: Params = {},
): Promise<T[]> {
  const clientId = process.env.JAMENDO_CLIENT_ID?.trim();
  if (!clientId) throw new Error("Missing JAMENDO_CLIENT_ID in .env.local");

  const query = new URLSearchParams({
    client_id: clientId,
    format: "json",
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ),
  });

  const res = await fetch(`${BASE_URL}/${endpoint}/?${query}`, {
    next: { revalidate: 3600 }, // cache for 1 hour
  });
  if (!res.ok) throw new Error(`Jamendo request failed: ${res.status}`);

  const data: JamendoResponse<T> = await res.json();
  if (data.headers.status !== "success") {
    throw new Error(data.headers.error_message || "Jamendo API error");
  }
  return data.results;
}

async function fetchTracks(params: Params): Promise<Track[]> {
  const results = await jamendoRequest<Track>("tracks", {
    imagesize: "300",
    audioformat: "mp32",
    type: "single albumtrack",
    ...params,
  });
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

export function getFeaturedTracks(limit = 12) {
  return fetchTracks({
    featured: 1,
    order: "popularity_week",
    groupby: "artist_id",
    limit,
  });
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
  return fetchTracks({ id: ids.join(" "), limit: Math.min(ids.length, 200) });
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
