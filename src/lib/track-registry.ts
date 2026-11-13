import type { Track } from "@/types/music";

const seen = new Map<string, Track>();

export function registerTracks(tracks: Track[]) {
  for (const track of tracks) seen.set(track.id, track);
}

export function lookupTrack(id: string): Track | undefined {
  return seen.get(id);
}
