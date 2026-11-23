"use client";

import Link from "next/link";
import { Heart, Pause, Play } from "lucide-react";
import TrackList from "@/components/TrackList";
import ListSkeleton from "@/components/ListSkeleton";
import LoadError from "@/components/LoadError";
import { usePlayer } from "@/components/PlayerProvider";
import { useLikedTracks } from "@/lib/use-liked-tracks";

export default function LikedSongs() {
  const { tracks, likedCount, ready, error, retry } = useLikedTracks();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  if (!ready) return <ListSkeleton />;

  const loaded = !!currentTrack && tracks.some((t) => t.id === currentTrack.id);
  const showPause = loaded && isPlaying;

  const handlePlay = () => {
    if (loaded) togglePlay();
    else playTrack(tracks[0], tracks);
  };

  return (
    <>
      <div className="mb-5 flex items-end gap-4 sm:mb-8 sm:gap-5">
        <div className="brand-gradient flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl shadow-[0_0_32px_rgba(76,217,100,0.25)] sm:h-32 sm:w-32 sm:rounded-[20px]">
          <Heart className="h-10 w-10 fill-[#0B0F0E] text-[#0B0F0E] sm:h-14 sm:w-14" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-fg-2">
            Playlist
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Liked Songs
          </h1>
          <p className="mt-1 font-mono text-xs text-fg-3 sm:mt-2">
            {tracks.length} {tracks.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      {tracks.length > 0 && (
        <div className="mb-5 sm:mb-6">
          <button
            onClick={handlePlay}
            className="brand-gradient flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-[#0B0F0E] shadow-[0_0_24px_rgba(76,217,100,0.4)] transition-transform hover:scale-105 active:scale-95 sm:w-auto"
          >
            {showPause ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            )}
            <span>{showPause ? "Pause" : "Play"}</span>
          </button>
        </div>
      )}

      {error && (
        <div className="mb-5 sm:mb-6">
          <LoadError
            message="Some of your songs couldn't be loaded."
            onRetry={retry}
          />
        </div>
      )}

      {tracks.length > 0 ? (
        <TrackList tracks={tracks} />
      ) : likedCount === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-surface p-6 text-center sm:p-8">
          <p className="mb-1 font-semibold">No liked songs yet</p>
          <p className="mb-5 text-sm text-fg-2">
            Tap the heart on any track to save it here.
          </p>
          <Link
            href="/"
            className="brand-gradient inline-flex min-h-11 items-center rounded-full px-6 text-sm font-bold text-[#0B0F0E]"
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
