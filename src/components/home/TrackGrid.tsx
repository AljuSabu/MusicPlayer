"use client";

import Image from "next/image";
import { Play, Pause } from "lucide-react";
import type { Track } from "@/types/music";
import { useTrackPlayback } from "@/lib/use-track-playback";

export default function TrackGrid({ tracks }: { tracks: Track[] }) {
  const { currentId, isPlaying, toggle } = useTrackPlayback(tracks);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
      {tracks.map((track) => {
        const isCurrent = currentId === track.id;
        const showPause = isCurrent && isPlaying;

        return (
          <div
            key={track.id}
            onClick={() => toggle(track)}
            className="group cursor-pointer rounded-2xl border border-white/8 bg-surface p-3.5 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-white/18 hover:bg-[#1B2421]"
          >
            <div className="relative mb-3.5 aspect-square w-full overflow-hidden rounded-[14px] bg-[#1B2421]">
              <Image
                src={track.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 17vw, (min-width: 640px) 28vw, 44vw"
                className="object-cover"
              />
              <button
                aria-label={`${showPause ? "Pause" : "Play"} ${track.name}`}
                className={`brand-gradient absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full text-[#0B0F0E] shadow-[0_0_20px_rgba(76,217,100,0.45)] transition-[opacity,transform] duration-200 ${
                  showPause
                    ? "scale-100 opacity-100"
                    : "scale-75 opacity-0 focus-visible:opacity-100 group-hover:scale-100 group-hover:opacity-100"
                }`}
              >
                {showPause ? (
                  <Pause className="h-4 w-4 fill-[#0B0F0E]" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4 fill-[#0B0F0E]" />
                )}
              </button>
            </div>

            <div className="space-y-1">
              <h3
                className={`truncate text-[14px] font-bold transition-colors ${
                  isCurrent
                    ? "text-[#4CD964]"
                    : "text-white group-hover:text-[#4CD964]"
                }`}
              >
                {track.name}
              </h3>
              <p className="truncate text-[12px] leading-4 text-[#A3B1AC]">
                {track.artist_name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
