import type { Track, JamendoResponse } from "@/types/music";

const BASE_URL = "https://api.jamendo.com/v3.0";

async function jamendoFetch(
  endpoint: string,
  params: Record<string, string | number> = {},
): Promise<Track[]> {
  const clientId = process.env.JAMENDO_CLIENT_ID;
  if (!clientId) throw new Error("Missing JAMENDO_CLIENT_ID in .env.local");

  const query = new URLSearchParams({
    client_id: clientId,
    format: "json",
    imagesize: "300",
    audioformat: "mp32", // better quality than the default
    type: "single albumtrack", // include singles, not just album tracks
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ),
  });

  const res = await fetch(`${BASE_URL}/${endpoint}/?${query}`, {
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!res.ok) throw new Error(`Jamendo request failed: ${res.status}`);

  const data: JamendoResponse<Track> = await res.json();
  if (data.headers.status !== "success") {
    throw new Error(data.headers.error_message || "Jamendo API error");
  }
  return data.results.map((t) => ({
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

export function getFeaturedTracks(limit = 12) {
  return jamendoFetch("tracks", {
    featured: 1,
    order: "popularity_week",
    groupby: "artist_id",
    limit,
  });
}

export function getTrendingTracks(limit = 10) {
  return jamendoFetch("tracks", {
    order: "popularity_week",
    groupby: "artist_id",
    limit,
  });
}

export function getNewReleases(limit = 10) {
  return jamendoFetch("tracks", {
    order: "releasedate_desc",
    groupby: "artist_id",
    limit,
  });
}

export function getTracksByGenre(genre: string, limit = 10) {
  return jamendoFetch("tracks", {
    tags: genre,
    order: "popularity_total",
    limit,
  });
}

export function searchTracks(query: string, limit = 20) {
  return jamendoFetch("tracks", { search: query, limit });
}

export function getTracksByIds(ids: string[]) {
  if (ids.length === 0) return Promise.resolve([]);
  return jamendoFetch("tracks", {
    id: ids.join(" "),
    limit: Math.min(ids.length, 200),
  });
}
