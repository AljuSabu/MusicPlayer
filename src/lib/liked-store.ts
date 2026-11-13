import type { Track } from "@/types/music";

const KEY = "vibra:liked-tracks";

let memory: Map<string, Track> | null = null;

function load(): Map<string, Track> {
  if (memory) return memory;
  memory = new Map();
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === "object") {
      for (const [id, track] of Object.entries(
        parsed as Record<string, Track>,
      )) {
        if (
          track &&
          typeof track.name === "string" &&
          typeof track.audio === "string"
        ) {
          memory.set(id, track);
        }
      }
    }
  } catch {
    // storage unavailable: start empty
  }
  return memory;
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(load())));
  } catch {
    // storage full or blocked: the in-memory copy still works this visit
  }
}

export function getSavedTrack(id: string): Track | undefined {
  return load().get(id);
}

export function saveTracks(tracks: Track[]) {
  if (tracks.length === 0) return;
  const store = load();
  tracks.forEach((track) => store.set(track.id, track));
  persist();
}

export function forgetTrack(id: string) {
  load().delete(id);
  persist();
}
