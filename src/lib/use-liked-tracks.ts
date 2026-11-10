"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Track } from "@/types/music";
import { usePlayer } from "@/components/PlayerProvider";

export function useLikedTracks() {
  const { likedIds, likesReady } = usePlayer();
  const [cache, setCache] = useState<Record<string, Track>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const requested = useRef(new Set<string>()); // ids we've already asked for

  useEffect(() => {
    if (!likesReady) return;

    const missing = likedIds.filter((id) => !requested.current.has(id));
    if (missing.length === 0) {
      setLoading(false);
      return;
    }
    missing.forEach((id) => requested.current.add(id));

    fetch(`/api/tracks?ids=${missing.join(",")}`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json() as Promise<Track[]>;
      })
      .then((fetched) =>
        setCache((prev) => ({
          ...prev,
          ...Object.fromEntries(fetched.map((t) => [t.id, t])),
        })),
      )
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [likesReady, likedIds]);

  // Newest like first
  const tracks = useMemo(
    () =>
      [...likedIds]
        .reverse()
        .map((id) => cache[id])
        .filter((t): t is Track => Boolean(t)),
    [likedIds, cache],
  );

  return {
    tracks,
    likedCount: likedIds.length,
    ready: likesReady && !loading,
    error,
  };
}
