"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Heart } from "lucide-react";
import type { Track } from "@/types/music";
import { useTrackPlayback } from "@/lib/use-track-playback";

export default function QuickTiles({ tracks }: { tracks: Track[] }) {
  const { currentId, isPlaying, toggle } = useTrackPlayback(tracks);
  const tiles = tracks.slice(0, 7);

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {/* Liked Songs tile */}
        <Link
          href="/liked"
          prefetch={false}
          className="group flex h-16 items-center gap-3.5 overflow-hidden rounded-lg border border-white/8 bg-surface transition-colors duration-200 hover:border-white/18 hover:bg-[#1B2421]"
        >
          <div className="brand-gradient flex h-16 w-16 shrink-0 items-center justify-center">
            <Heart className="h-6 w-6 fill-[#0B0F0E] text-[#0B0F0E]" />
          </div>
          <span className="flex-1 truncate pr-2 text-xs font-bold text-white sm:text-[13px]">
            Liked Songs
          </span>
        </Link>

        {tiles.map((track) => {
          const showPause = currentId === track.id && isPlaying;
          return (
            <div
              key={track.id}
              onClick={() => toggle(track)}
              className="group flex h-16 cursor-pointer items-center gap-3.5 overflow-hidden rounded-lg border border-white/8 bg-surface transition-colors duration-200 hover:border-white/18 hover:bg-[#1B2421]"
            >
              <div className="relative h-16 w-16 shrink-0 bg-[#1B2421]">
                <Image
                  src={track.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              <span className="flex-1 truncate pr-2 text-xs font-bold text-white sm:text-[13px]">
                {track.name}
              </span>

              <button
                aria-label={`${showPause ? "Pause" : "Play"} ${track.name}`}
                className={`brand-gradient mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#0B0F0E] shadow-[0_0_16px_rgba(76,217,100,0.5)] transition-[opacity,transform] duration-200 ${
                  showPause
                    ? "scale-100 opacity-100"
                    : "scale-75 opacity-0 focus-visible:opacity-100 group-hover:scale-100 group-hover:opacity-100"
                }`}
              >
                {showPause ? (
                  <Pause className="h-3.5 w-3.5 fill-[#0B0F0E]" />
                ) : (
                  <Play className="ml-0.5 h-3.5 w-3.5 fill-[#0B0F0E]" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
