"use client";

import { Clock, Heart, Play } from "lucide-react";
import type { Track } from "@/types/music";
import { usePlayer } from "@/components/PlayerProvider";
import { useTrackPlayback } from "@/lib/use-track-playback";
import { formatTime } from "@/lib/utils";

export default function AlbumTrackList({ tracks }: { tracks: Track[] }) {
  const { currentId, isPlaying, toggle } = useTrackPlayback(tracks);
  const { isLiked, toggleLike } = usePlayer();

  return (
    <section className="space-y-2">
      {/* Table header: not needed on phones */}
      <div className="hidden grid-cols-12 gap-4 border-b border-white/8 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#6B7A75] sm:grid">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-9">Title</div>
        <div className="col-span-2 flex items-center justify-end gap-2 pr-2">
          <Clock className="h-3.5 w-3.5" />
          <span>Duration</span>
        </div>
      </div>

      <ul className="space-y-1">
        {tracks.map((track, i) => {
          const isCurrent = currentId === track.id;
          const showPause = isCurrent && isPlaying;
          const liked = isLiked(track.id);

          return (
            <li
              key={track.id}
              onClick={() => toggle(track)}
              // Phones: a flex row. sm and up: the 12-column table.
              className={`group flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border py-1 pl-3 pr-1 transition-colors sm:grid sm:grid-cols-12 sm:gap-4 sm:px-4 sm:py-3 ${
                isCurrent
                  ? "border-[#4CD964]/40 bg-elevated"
                  : "border-transparent bg-surface/50 hover:border-white/8 hover:bg-elevated active:bg-elevated"
              }`}
            >
              {/* # / play on hover / equalizer */}
              <div className="w-5 shrink-0 text-center sm:col-span-1 sm:w-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(track);
                  }}
                  aria-label={`${showPause ? "Pause" : "Play"} ${track.name}`}
                  className="w-full font-mono text-xs text-[#6B7A75]"
                >
                  {showPause ? (
                    <span className="flex h-5 items-end justify-center gap-0.5">
                      <span className="animate-eq-1 w-1 rounded-full bg-[#4CD964]" />
                      <span className="animate-eq-2 w-1 rounded-full bg-[#A6E23A]" />
                      <span className="animate-eq-3 w-1 rounded-full bg-[#1BC5A0]" />
                    </span>
                  ) : (
                    <>
                      <span
                        className={`group-hover:hidden ${isCurrent ? "text-[#4CD964]" : ""}`}
                      >
                        {i + 1}
                      </span>
                      <Play className="mx-auto hidden h-3.5 w-3.5 fill-current text-white group-hover:block" />
                    </>
                  )}
                </button>
              </div>

              {/* Title + artist */}
              <div className="min-w-0 flex-1 sm:col-span-9 sm:pr-2">
                <p
                  className={`truncate text-xs font-bold sm:text-sm sm:font-semibold ${
                    isCurrent ? "text-[#4CD964]" : "text-white"
                  }`}
                >
                  {track.name}
                </p>
                <p className="truncate text-[11px] text-[#A3B1AC] sm:text-xs">
                  {track.artist_name}
                </p>
              </div>

              {/* Heart + duration (44px heart target on phones) */}
              <div className="flex shrink-0 items-center gap-0.5 sm:col-span-2 sm:justify-end sm:gap-3 sm:pr-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(track.id);
                  }}
                  aria-label={
                    liked ? "Remove from Liked Songs" : "Save to Liked Songs"
                  }
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors sm:h-8 sm:w-8 ${
                    liked ? "text-[#4CD964]" : "text-[#6B7A75] hover:text-white"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                </button>
                <span className="w-9 text-right font-mono text-[11px] text-[#A3B1AC] sm:w-10 sm:text-xs">
                  {formatTime(track.duration)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
