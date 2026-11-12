"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Track } from "@/types/music";
import { usePlayer } from "@/components/PlayerProvider";

// Lives for the whole browser session: Library <-> Liked Songs is instant
// and each track is only downloaded once.
const trackCache = new Map<string, Track>();
// Ids Jamendo has no track for (e.g. removed). Don't keep asking.
const unavailable = new Set<string>();

const CHUNK_SIZE = 50;
const MAX_ATTEMPTS = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchChunk(ids: string[]): Promise<Track[]> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`/api/tracks?ids=${ids.join(",")}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as Track[];
    } catch (err) {
      lastError = err;
      if (attempt < MAX_ATTEMPTS) await sleep(500 * attempt);
    }
  }
  throw lastError;
}

type Status = "loading" | "done" | "error";

export function useLikedTracks() {
  const { likedIds, likesReady } = usePlayer();
  const [status, setStatus] = useState<Status>("loading");
  const [version, setVersion] = useState(0); // bumped when the shared cache changes
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!likesReady) return;

    const missing = likedIds.filter(
      (id) => !trackCache.has(id) && !unavailable.has(id),
    );
    if (missing.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("done");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    (async () => {
      const chunks: string[][] = [];
      for (let i = 0; i < missing.length; i += CHUNK_SIZE) {
        chunks.push(missing.slice(i, i + CHUNK_SIZE));
      }

      const results = await Promise.allSettled(chunks.map(fetchChunk));

      results.forEach((result, i) => {
        if (result.status !== "fulfilled") return; // failed chunks stay "missing" so Try again can retry them
        const returned = new Set<string>();
        result.value.forEach((track) => {
          trackCache.set(track.id, track);
          returned.add(track.id);
        });
        chunks[i].forEach((id) => {
          if (!returned.has(id)) unavailable.add(id);
        });
      });

      if (cancelled) return;
      setVersion((v) => v + 1);
      setStatus(
        results.some((r) => r.status === "rejected") ? "error" : "done",
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [likesReady, likedIds, retryCount]);

  // Newest like first
  const tracks = useMemo(() => {
    void version; // re-run when the shared cache changes
    return [...likedIds]
      .reverse()
      .map((id) => trackCache.get(id))
      .filter((t): t is Track => Boolean(t));
  }, [likedIds, version]);

  const retry = useCallback(() => setRetryCount((n) => n + 1), []);

  // Only show the skeleton while there is nothing to show yet
  const loading = status === "loading" && tracks.length === 0;

  return {
    tracks,
    likedCount: likedIds.length,
    ready: likesReady && !loading,
    error: status === "error",
    retry,
  };
}
