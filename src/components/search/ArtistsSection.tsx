import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { searchArtists } from "@/lib/jamendo";
import SectionHeader from "./SectionHeader";

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
    <section className="[contain-intrinsic-size:auto_300px] [content-visibility:auto]">
      <SectionHeader
        title="Artists"
        subtitle="Musicians & sound designers"
        seeAllHref={
          full
            ? undefined
            : `/search?q=${encodeURIComponent(query)}&type=artists`
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-5">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artist/${artist.id}`}
            prefetch={false}
            className="group flex flex-col items-center rounded-[20px] border border-white/8 bg-surface p-4 text-center transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-white/16 hover:bg-[#1B2421] sm:p-5"
          >
            <div className="relative mb-3.5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-white/12 bg-[#1B2421] sm:h-32 sm:w-32">
              {artist.image ? (
                <Image
                  src={artist.image}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-white/60" />
              )}
            </div>

            <h3 className="w-full truncate text-sm font-bold tracking-tight text-white transition-colors group-hover:text-[#4CD964]">
              {artist.name}
            </h3>
            <span className="mt-0.5 text-xs text-[#A3B1AC]">Artist</span>
            {artist.joindate && (
              <span className="mt-1 font-mono text-[11px] text-[#6B7A75]">
                Joined {artist.joindate.slice(0, 4)}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
