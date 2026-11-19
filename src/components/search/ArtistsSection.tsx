import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { searchArtists } from "@/lib/jamendo";
import SectionHeader from "./SectionHeader";

// All tab: a scroll row on phones and tablets, a grid from lg.
const shelfLayout =
  "no-scrollbar -mx-4 flex gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:p-0";
// Artists tab: a wrapped grid at every size.
const gridLayout =
  "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-6";

export default async function ArtistsSection({
  query,
  full,
}: {
  query: string;
  full: boolean;
}) {
  const artists = await searchArtists(query, full ? 20 : 5).catch(() => []);

  if (artists.length === 0) {
    return full ? (
      <p className="text-sm text-[#A3B1AC]">No artists found.</p>
    ) : null;
  }

  return (
    <section className="lg:[contain-intrinsic-size:auto_300px] lg:[content-visibility:auto]">
      <SectionHeader
        title="Artists"
        subtitle="Musicians & sound designers"
        seeAllHref={
          full
            ? undefined
            : `/search?q=${encodeURIComponent(query)}&type=artists`
        }
      />

      <div className={full ? gridLayout : shelfLayout}>
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artist/${artist.id}`}
            prefetch={false}
            className={`group flex flex-col items-center rounded-[20px] border border-white/8 bg-surface p-3 text-center transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-white/16 hover:bg-[#1B2421] active:scale-[0.98] lg:p-5 ${
              full ? "" : "w-28 shrink-0 sm:w-32 lg:w-auto"
            }`}
          >
            <div className="relative mb-2.5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-white/12 bg-[#1B2421] sm:h-24 sm:w-24 lg:mb-3.5 lg:h-32 lg:w-32">
              {artist.image ? (
                <Image
                  src={artist.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 128px, 96px"
                  className="object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-white/60 lg:h-12 lg:w-12" />
              )}
            </div>

            <h3 className="w-full truncate text-xs font-bold tracking-tight text-white transition-colors group-hover:text-[#4CD964] sm:text-sm">
              {artist.name}
            </h3>
            <span className="mt-0.5 text-[11px] text-[#A3B1AC] sm:text-xs">
              Artist
            </span>
            {artist.joindate && (
              <span className="mt-1 hidden font-mono text-[11px] text-[#6B7A75] lg:block">
                Joined {artist.joindate.slice(0, 4)}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
