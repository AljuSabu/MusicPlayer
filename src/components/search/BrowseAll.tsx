import Link from "next/link";
import { ArrowRight, Music } from "lucide-react";
import { allGenres } from "@/lib/genres";

export default function BrowseAll() {
  return (
    <section className="lg:[contain-intrinsic-size:auto_640px] lg:[content-visibility:auto]">
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-white sm:text-xl">
            Browse all
          </h2>
          <p className="mt-0.5 text-xs text-[#A3B1AC]">
            Pick a genre and start listening
          </p>
        </div>
        <span className="text-xs text-[#6B7A75]">
          {allGenres.length} categories
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {allGenres.map((genre) => (
          <Link
            key={genre.slug}
            href={`/genre/${genre.slug}`}
            prefetch={false}
            className={`group relative h-24 overflow-hidden rounded-2xl border border-white/12 bg-linear-to-br p-3.5 transition-transform duration-300 hover:-translate-y-1 active:scale-[0.97] sm:h-44 sm:p-5 lg:h-48 ${genre.gradient}`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0B0F0E]/90 via-[#0B0F0E]/40 to-transparent"
            />

            <div className="relative z-10">
              <h3 className="text-sm font-bold leading-tight tracking-tight text-white drop-shadow-md transition-colors group-hover:text-[#A6E23A] sm:text-xl">
                {genre.name}
              </h3>
              <p className="mt-1 line-clamp-2 hidden max-w-[85%] text-xs font-medium text-white/80 sm:block">
                {genre.tagline}
              </p>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-4 -right-4 hidden h-24 w-24 rotate-12 items-center justify-center rounded-full bg-white/12 sm:flex"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25">
                <Music className="h-7 w-7 text-white/70" />
              </div>
            </div>

            <div className="absolute bottom-3 left-3.5 z-10 flex items-center gap-1.5 text-[10px] font-semibold text-white/90 sm:bottom-4 sm:left-5 sm:text-xs">
              <span>Explore</span>
              <ArrowRight className="hidden h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:block" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
