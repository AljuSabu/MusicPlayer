"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Play, Pause, Heart } from "lucide-react";
import type { Track } from "@/types/music";
import { usePlayer } from "@/components/PlayerProvider";
import { registerTracks } from "@/lib/track-registry";
import { formatTime } from "@/lib/utils";

export default function TrackList({ tracks }: { tracks: Track[] }) {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    isLiked,
    toggleLike,
  } = usePlayer();

  useEffect(() => {
    registerTracks(tracks);
  }, [tracks]);

  const toggle = (track: Track) => {
    if (currentTrack?.id === track.id) togglePlay();
    else playTrack(track, tracks);
  };

  return (
    <ul className="space-y-1.5 sm:space-y-2">
      {tracks.map((track) => {
        const isCurrent = currentTrack?.id === track.id;
        const showPause = isCurrent && isPlaying;
        const liked = isLiked(track.id);

        return (
          <li
            key={track.id}
            onClick={() => toggle(track)}
            className={`group flex min-h-16 cursor-pointer items-center gap-3 rounded-xl py-1.5 pl-2 pr-1 transition-colors sm:gap-4 sm:p-3 ${
              isCurrent
                ? "bg-elevated"
                : "bg-white/5 hover:bg-white/10 active:bg-white/10"
            }`}
          >
            {/* The cover is the play button (this is what screen readers and keyboards use) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle(track);
              }}
              aria-label={`${showPause ? "Pause" : "Play"} ${track.name}`}
              className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-elevated sm:h-16 sm:w-16"
            >
              <Image
                src={track.image}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
              {showPause && (
                <span className="absolute inset-0 flex items-end justify-center gap-0.5 bg-black/50 pb-2.5">
                  <span className="animate-eq-1 w-1 rounded-full bg-[#4CD964]" />
                  <span className="animate-eq-2 w-1 rounded-full bg-[#A6E23A]" />
                  <span className="animate-eq-3 w-1 rounded-full bg-[#1BC5A0]" />
                </span>
              )}
            </button>

            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-semibold sm:text-base ${
                  isCurrent ? "text-brand" : ""
                }`}
              >
                {track.name}
              </p>
              <p className="truncate text-xs text-fg-2 sm:text-sm">
                {track.artist_name}
              </p>
            </div>

            {/* 44px tap target on phones */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(track.id);
              }}
              aria-label={
                liked ? "Remove from Liked Songs" : "Save to Liked Songs"
              }
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors sm:h-9 sm:w-9 ${
                liked ? "text-[#4CD964]" : "text-[#6B7A75] hover:text-white"
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-[#4CD964]" : ""}`} />
            </button>

            <span className="w-9 shrink-0 text-right font-mono text-[11px] text-fg-3 sm:w-auto sm:text-xs">
              {formatTime(track.duration)}
            </span>

            {/* Large screens: the big play button. Hidden from screen readers
                because the cover button above already does the same job. */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle(track);
              }}
              aria-hidden="true"
              tabIndex={-1}
              className="brand-gradient hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0B0F0E] sm:flex"
            >
              {showPause ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
