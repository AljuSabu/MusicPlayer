"use client";

import Image from "next/image";
import { Heart, Pause, Play, SkipForward } from "lucide-react";
import { usePlayer, useAudioTime } from "@/components/PlayerProvider";

export default function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    next,
    isLiked,
    toggleLike,
    openNowPlaying,
  } = usePlayer();

  // Nothing playing yet: only the tab bar shows
  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.id);

  return (
    <section
      aria-label="Now playing"
      className="border-t border-white/8 bg-surface"
    >
      <MiniProgress />

      <div className="flex items-center gap-1 px-3 py-2">
        <button
          type="button"
          onClick={openNowPlaying}
          aria-label={`Open full-screen player: ${currentTrack.name}`}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left"
        >
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-elevated">
            <Image
              src={currentTrack.image}
              alt=""
              fill
              sizes="44px"
              className="object-cover"
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-bold leading-tight text-white">
              {currentTrack.name}
            </span>
            <span className="mt-0.5 block truncate text-[11px] text-[#A3B1AC]">
              {currentTrack.artist_name}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => toggleLike(currentTrack.id)}
          aria-label={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
          className="flex h-11 w-11 shrink-0 items-center justify-center text-[#A3B1AC]"
        >
          <Heart
            className={`h-4 w-4 ${liked ? "fill-[#4CD964] text-[#4CD964]" : ""}`}
          />
        </button>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-11 w-11 shrink-0 items-center justify-center transition-transform active:scale-95"
        >
          <span className="brand-gradient flex h-8 w-8 items-center justify-center rounded-full text-[#0B0F0E] shadow-[0_0_12px_rgba(76,217,100,0.4)]">
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            )}
          </span>
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next track"
          className="flex h-11 w-11 shrink-0 items-center justify-center text-[#A3B1AC]"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

// The only part that updates every tick
function MiniProgress() {
  const { duration } = usePlayer();
  const time = useAudioTime();
  const progress = duration > 0 ? Math.min(1, time / duration) : 0;

  return (
    <div aria-hidden="true" className="h-1 w-full bg-white/6">
      <div
        className="brand-gradient h-full origin-left"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
