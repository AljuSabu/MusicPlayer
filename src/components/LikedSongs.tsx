"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import TrackList from "@/components/TrackList";
import ListSkeleton from "@/components/ListSkeleton";
import LoadError from "@/components/LoadError";
import { useLikedTracks } from "@/lib/use-liked-tracks";

export default function LikedSongs() {
  const { tracks, likedCount, ready, error, retry } = useLikedTracks();

  if (!ready) return <ListSkeleton />;

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

      {error && (
        <div className="mb-6">
          <LoadError
            message="Some of your songs couldn't be loaded."
            onRetry={retry}
          />
        </div>
      )}

      {tracks.length > 0 ? (
        <TrackList tracks={tracks} />
      ) : likedCount === 0 ? (
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
        !error && (
          <p className="text-sm text-fg-2">
            Your liked songs are no longer available to stream.
          </p>
        )
      )}
    </>
  );
}
