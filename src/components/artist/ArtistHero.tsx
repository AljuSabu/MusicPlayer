import Image from "next/image";
import Link from "next/link";
import type { ArtistProfile } from "@/lib/jamendo";
import { artistImageUrl } from "@/lib/library";
import type { Track } from "@/types/music";
import ArtistActions from "./ArtistActions";

export default function ArtistHero({
  artist,
  queue,
}: {
  artist: ArtistProfile;
  queue: Track[];
}) {
  return (
    <section className="relative flex min-h-85 flex-col justify-end overflow-hidden rounded-3xl border border-white/8 bg-[#0E2019] p-6 sm:min-h-95 sm:p-10">
      {/* Artist photo, faded into the background */}
      <Image
        src={artistImageUrl(artist.id, 600)}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="object-cover object-top opacity-40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-[#0B0F0E] via-[#0B0F0E]/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-[#0B0F0E] via-[#0B0F0E]/70 to-transparent"
      />

      <div className="relative z-20 max-w-3xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[#4CD964]/30 bg-surface px-3 py-1 text-xs font-semibold text-[#4CD964]">
            Artist
          </span>
          {artist.joindate && (
            <span className="hidden text-xs font-medium text-[#A3B1AC] sm:inline">
              • Joined {artist.joindate.slice(0, 4)}
            </span>
          )}
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl sm:leading-14">
          {artist.name}
        </h1>

        {artist.bio && (
          <p className="line-clamp-2 max-w-2xl text-xs text-[#A3B1AC] sm:text-sm">
            {artist.bio}
          </p>
        )}

        {artist.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {artist.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                prefetch={false}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium capitalize text-[#A3B1AC] transition-colors hover:border-[#4CD964]/40 hover:text-white"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <ArtistActions
          tracks={queue}
          jamendoUrl={artist.shareurl}
          website={artist.website}
        />
      </div>
    </section>
  );
}
