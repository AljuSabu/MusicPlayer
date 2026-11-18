"use client";

import Image from "next/image";
import { Play, Pause } from "lucide-react";
import type { Track } from "@/types/music";
import { useTrackPlayback } from "@/lib/use-track-playback";

export default function TrackGrid({ tracks }: { tracks: Track[] }) {
  const { currentId, isPlaying, toggle } = useTrackPlayback(tracks);

  return (
    <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 pt-1 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:p-0">
      {tracks.map((track) => {
        const isCurrent = currentId === track.id;
        const showPause = isCurrent && isPlaying;

        return (
          <div
            key={track.id}
            onClick={() => toggle(track)}
            className="group w-36 shrink-0 cursor-pointer rounded-2xl border border-white/8 bg-surface p-2.5 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-white/18 hover:bg-[#1B2421] active:scale-[0.98] sm:w-40 lg:w-auto lg:p-3.5"
          >
            <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-xl bg-[#1B2421] lg:mb-3.5 lg:rounded-[14px]">
              <Image
                src={track.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 17vw, 160px"
                className="object-cover"
              />
              <button
                aria-label={`${showPause ? "Pause" : "Play"} ${track.name}`}
                className={`brand-gradient absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full text-[#0B0F0E] shadow-[0_0_20px_rgba(76,217,100,0.45)] transition-[opacity,transform] duration-200 lg:bottom-3 lg:right-3 lg:h-10 lg:w-10 ${
                  showPause
                    ? "scale-100 opacity-100"
                    : "scale-75 opacity-0 focus-visible:opacity-100 group-hover:scale-100 group-hover:opacity-100 touch:scale-100 touch:opacity-100"
                }`}
              >
                {showPause ? (
                  <Pause className="h-3.5 w-3.5 fill-[#0B0F0E] lg:h-4 lg:w-4" />
                ) : (
                  <Play className="ml-0.5 h-3.5 w-3.5 fill-[#0B0F0E] lg:h-4 lg:w-4" />
                )}
              </button>
            </div>

            <div className="space-y-0.5 lg:space-y-1">
              <h3
                className={`truncate text-xs font-bold leading-tight transition-colors lg:text-[14px] ${
                  isCurrent
                    ? "text-[#4CD964]"
                    : "text-white group-hover:text-[#4CD964]"
                }`}
              >
                {track.name}
              </h3>
              <p className="truncate text-[11px] text-[#A3B1AC] lg:text-[12px] lg:leading-4">
                {track.artist_name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
