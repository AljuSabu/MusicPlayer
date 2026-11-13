"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Track } from "@/types/music";
import { usePlayer } from "@/components/PlayerProvider";
import { getSavedTrack, saveTracks } from "@/lib/liked-store";

const CHUNK_SIZE = 50;
const MAX_ATTEMPTS = 3;

// Songs we tried hard to load and couldn't. Cleared by "Try again".
const gaveUp = new Set<string>();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Keeps asking until every id has arrived, or attempts run out.
// Never throws: whatever is still missing is reported by the caller.
async function fetchComplete(ids: string[]): Promise<Track[]> {
  let found: Track[] = [];
  let pending = ids;

  for (
    let attempt = 1;
    attempt <= MAX_ATTEMPTS && pending.length > 0;
    attempt++
  ) {
    try {
      const res = await fetch(`/api/tracks?ids=${pending.join(",")}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const batch = (await res.json()) as Track[];
      found = [...found, ...batch];
      const got = new Set(batch.map((t) => t.id));
      pending = pending.filter((id) => !got.has(id));
    } catch {
      // fall through and try again
    }
    if (pending.length > 0 && attempt < MAX_ATTEMPTS)
      await sleep(600 * attempt);
  }
  return found;
}

export function useLikedTracks() {
  const { likedIds, likesReady } = usePlayer();
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!likesReady) return;

    // Only songs liked before this update have no saved copy
    const missing = likedIds.filter(
      (id) => !getSavedTrack(id) && !gaveUp.has(id),
    );
    if (missing.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const chunks: string[][] = [];
      for (let i = 0; i < missing.length; i += CHUNK_SIZE) {
        chunks.push(missing.slice(i, i + CHUNK_SIZE));
      }

      const loaded = (await Promise.all(chunks.map(fetchComplete))).flat();
      saveTracks(loaded); // from now on these never need the API again
      missing.forEach((id) => {
        if (!getSavedTrack(id)) gaveUp.add(id);
      });

      if (cancelled) return;
      setVersion((v) => v + 1);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [likesReady, likedIds, retryCount]);

  // Newest like first, straight from the saved copies
  const tracks = useMemo(() => {
    void version;
    if (!likesReady) return [];
    return [...likedIds]
      .reverse()
      .map((id) => getSavedTrack(id))
      .filter((t): t is Track => Boolean(t));
  }, [likedIds, likesReady, version]);

  const unavailable = likesReady ? likedIds.length - tracks.length : 0;

  const retry = useCallback(() => {
    gaveUp.clear();
    setRetryCount((n) => n + 1);
  }, []);

  return {
    tracks,
    likedCount: likedIds.length,
    ready: likesReady && !(loading && tracks.length === 0),
    error: !loading && unavailable > 0,
    retry,
  };
}
