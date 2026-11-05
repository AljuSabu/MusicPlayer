"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Track } from "@/types/music";
import { usePlayer } from "@/components/PlayerProvider";
import TrackList from "@/components/TrackList";
import ListSkeleton from "@/components/ListSkeleton";

export default function LikedSongs() {
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
      .then((tracks) =>
        setCache((prev) => ({
          ...prev,
          ...Object.fromEntries(tracks.map((t) => [t.id, t])),
        })),
      )
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [likesReady, likedIds]);

  // Most recently liked first
  const tracks = useMemo(
    () =>
      [...likedIds]
        .reverse()
        .map((id) => cache[id])
        .filter((t): t is Track => Boolean(t)),
    [likedIds, cache],
  );

  if (!likesReady || loading) return <ListSkeleton />;

  return (
    <>
      <div className="mb-8 flex items-end gap-5">
        <div className="brand-gradient flex h-32 w-32 shrink-0 items-center justify-center rounded-[20px] shadow-[0_0_32px_rgba(76,217,100,0.25)]">
          <Heart className="h-14 w-14 fill-[#0B0F0E] text-[#0B0F0E]" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-fg-2">
            Playlist
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Liked Songs
          </h1>
          <p className="mt-2 font-mono text-xs text-fg-3">
            {tracks.length} {tracks.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      {error && tracks.length === 0 ? (
        <p className="text-fg-2">
          Couldn&apos;t load your liked songs. Try refreshing.
        </p>
      ) : tracks.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-surface p-8 text-center">
          <p className="mb-1 font-semibold">No liked songs yet</p>
          <p className="mb-5 text-sm text-fg-2">
            Tap the heart on any track to save it here.
          </p>
          <Link
            href="/"
            className="brand-gradient inline-block rounded-full px-5 py-2.5 text-sm font-bold text-[#0B0F0E]"
          >
            Find music
          </Link>
        </div>
      ) : (
        <TrackList tracks={tracks} />
      )}
    </>
  );
}
