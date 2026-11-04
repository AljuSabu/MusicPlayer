import Link from "next/link";
import { Music } from "lucide-react";
import { genres } from "@/lib/genres";

export default function GenreBrowseRow() {
  return (
    <section className="mb-14 [contain-intrinsic-size:auto_220px] [content-visibility:auto]">
      <div className="mb-5">
        <h2 className="text-[22px] font-bold leading-7.5 tracking-tight text-white">
          Browse by Genre
        </h2>
        <p className="mt-0.5 text-xs text-[#A3B1AC]">
          Find your next favorite sound.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
        {genres.map((genre) => (
          <Link
            key={genre.slug}
            href={`/genre/${genre.slug}`}
            prefetch={false}
            className={`group relative flex h-28 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br p-3.5 transition-transform duration-200 hover:scale-[1.03] sm:h-32 ${genre.gradient}`}
          >
            <span className="z-10 text-sm font-bold leading-tight text-white drop-shadow-sm">
              {genre.name}
            </span>
            <div className="absolute -bottom-2 -right-2 flex h-14 w-14 rotate-12 items-center justify-center rounded-full border border-white/20 bg-black/30 transition-transform group-hover:rotate-45">
              <Music className="h-5 w-5 text-white/70" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
