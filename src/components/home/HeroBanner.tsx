import Image from "next/image";
import { Sparkles } from "lucide-react";
import type { Track } from "@/types/music";
import HeroPlayButton from "./HeroPlayButton";

export default function HeroBanner({ tracks }: { tracks: Track[] }) {
  const cover = tracks[0];
  const totalMinutes = Math.round(
    tracks.reduce((sum, t) => sum + t.duration, 0) / 60,
  );

  return (
    <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/8 bg-surface sm:mb-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#A6E23A]/25 via-[#131A18]/80 to-[#1BC5A0]/20"
      />

      <div className="relative z-10 flex items-center gap-4 p-4 sm:p-6 lg:justify-between lg:gap-8 lg:p-12">
        {/* Cover: first on phones and tablets, on the right on large screens */}
        <div className="relative order-first h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/12 bg-[#1B2421] sm:h-32 sm:w-32 lg:order-last lg:h-64 lg:w-64 lg:rounded-[20px] lg:border-2">
          <Image
            src={cover.image}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 256px, 128px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 hidden bg-linear-to-t from-black/70 to-transparent p-4 text-right font-mono text-[11px] text-[#4CD964] lg:block">
            Vibra Picks
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2 lg:max-w-xl lg:flex-none lg:space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-[#0B0F0E] px-2.5 py-0.5 text-[10px] font-semibold text-[#4CD964] sm:text-xs lg:px-3 lg:py-1">
            <Sparkles className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
            <span>BUZZING THIS WEEK</span>
          </div>

          <h2 className="text-lg font-bold leading-tight tracking-tight text-white sm:text-2xl lg:text-[44px] lg:leading-12.5">
            This Week&apos;s Highlights
          </h2>

          <p className="line-clamp-2 max-w-lg text-[11px] leading-relaxed text-[#A3B1AC] sm:text-sm lg:line-clamp-none lg:text-sm">
            Tracks from independent artists that are picking up momentum with
            listeners right now, free to stream.
          </p>

          <div className="flex flex-wrap items-center gap-x-2 pt-1 font-mono text-[11px] text-[#6B7A75] sm:text-xs">
            <span className="font-medium text-white">Vibra Picks</span>
            <span>·</span>
            <span>{tracks.length} tracks</span>
            <span>·</span>
            <span>{totalMinutes} min</span>
          </div>

          {/* Large screens: button sits with the text */}
          <div className="hidden pt-3 lg:block">
            <HeroPlayButton tracks={tracks} />
          </div>
        </div>
      </div>

      {/* Phones and tablets: full-width button under the card */}
      <div className="relative z-10 border-t border-white/6 p-4 pt-3 lg:hidden [&>button]:min-h-11 [&>button]:w-full [&>button]:justify-center">
        <HeroPlayButton tracks={tracks} />
      </div>
    </section>
  );
}
