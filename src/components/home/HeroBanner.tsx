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
    <section className="relative mb-12 overflow-hidden rounded-3xl border border-white/8 bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#A6E23A]/25 via-[#131A18]/80 to-[#1BC5A0]/20"
      />

      <div className="relative z-10 flex flex-col items-start justify-between gap-8 p-6 sm:p-10 md:flex-row md:items-center lg:p-12">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-[#0B0F0E] px-3 py-1 text-xs font-semibold text-[#4CD964]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>BUZZING THIS WEEK</span>
          </div>

          <h2 className="text-[32px] font-bold leading-9.5 tracking-tight text-white sm:text-[44px] sm:leading-12.5">
            This Week&apos;s Highlights
          </h2>

          <p className="max-w-lg text-xs leading-relaxed text-[#A3B1AC] sm:text-sm">
            Tracks from independent artists that are picking up momentum with
            listeners right now, free to stream.
          </p>

          <div className="flex items-center gap-2 pt-1 font-mono text-xs text-[#6B7A75]">
            <span className="font-medium text-white">Vibra Picks</span>
            <span>·</span>
            <span>{tracks.length} tracks</span>
            <span>·</span>
            <span>{totalMinutes} min</span>
          </div>

          <div className="pt-3">
            <HeroPlayButton tracks={tracks} />
          </div>
        </div>

        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-[20px] border-2 border-white/12 bg-[#1B2421] sm:h-56 sm:w-56 lg:h-64 lg:w-64">
          <Image
            src={cover.image}
            alt=""
            fill
            priority
            sizes="256px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4 text-right font-mono text-[11px] text-[#4CD964]">
            Vibra Picks
          </div>
        </div>
      </div>
    </section>
  );
}
