import Link from "next/link";
import { ArrowRight, Music } from "lucide-react";
import { allGenres } from "@/lib/genres";

export default function BrowseAll() {
  return (
    <section className="[contain-intrinsic-size:auto_640px] [content-visibility:auto]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4">
        {allGenres.map((genre) => (
          <Link
            key={genre.slug}
            href={`/genre/${genre.slug}`}
            prefetch={false}
            className={`group relative h-44 overflow-hidden rounded-2xl border border-white/12 bg-linear-to-br p-5 transition-transform duration-300 hover:-translate-y-1 sm:h-48 ${genre.gradient}`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0B0F0E]/90 via-[#0B0F0E]/40 to-transparent"
            />

            <div className="relative z-10">
              <h3 className="text-lg font-bold tracking-tight text-white drop-shadow-md transition-colors group-hover:text-[#A6E23A] sm:text-xl">
                {genre.name}
              </h3>
              <p className="mt-1 line-clamp-2 max-w-[85%] text-xs font-medium text-white/80">
                {genre.tagline}
              </p>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-4 -right-4 flex h-24 w-24 rotate-12 items-center justify-center rounded-full bg-white/12"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25">
                <Music className="h-7 w-7 text-white/70" />
              </div>
            </div>

            <div className="absolute bottom-4 left-5 z-10 flex items-center gap-1.5 text-xs font-semibold text-white/90">
              <span>Explore</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
