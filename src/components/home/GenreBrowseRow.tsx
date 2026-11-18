import Link from "next/link";
import { Music } from "lucide-react";
import { genres } from "@/lib/genres";

export default function GenreBrowseRow() {
  return (
    <section className="mb-10 sm:mb-14 lg:[contain-intrinsic-size:auto_220px] lg:[content-visibility:auto]">
      <div className="mb-3 sm:mb-5">
        <h2 className="text-base font-bold tracking-tight text-white sm:text-[22px] sm:leading-7.5">
          Browse by Genre
        </h2>
        <p className="mt-0.5 text-xs text-[#A3B1AC]">
          Find your next favorite sound.
        </p>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto overscroll-x-contain px-4 pb-2 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-8 lg:gap-4 lg:overflow-visible lg:p-0">
        {genres.map((genre) => (
          <Link
            key={genre.slug}
            href={`/genre/${genre.slug}`}
            prefetch={false}
            className={`group relative flex min-h-11 shrink-0 items-center overflow-hidden rounded-xl border border-white/10 bg-linear-to-br px-4 py-2.5 transition-transform duration-200 active:scale-95 lg:h-32 lg:flex-col lg:items-stretch lg:justify-between lg:rounded-2xl lg:p-3.5 lg:hover:scale-[1.03] ${genre.gradient}`}
          >
            <span className="z-10 whitespace-nowrap text-xs font-bold leading-tight text-white drop-shadow-sm lg:text-sm">
              {genre.name}
            </span>
            <div className="absolute -bottom-2 -right-2 hidden h-14 w-14 rotate-12 items-center justify-center rounded-full border border-white/20 bg-black/30 transition-transform group-hover:rotate-45 lg:flex">
              <Music className="h-5 w-5 text-white/70" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
