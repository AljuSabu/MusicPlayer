import Image from "next/image";
import Link from "next/link";
import { getSimilarArtists } from "@/lib/jamendo";

export default async function SimilarArtists({
  tag,
  excludeId,
}: {
  tag: string;
  excludeId: string;
}) {
  const artists = await getSimilarArtists(tag, excludeId, 5).catch(() => []);
  if (artists.length === 0) return null;

  return (
    <section className="space-y-3 sm:space-y-4 lg:[contain-intrinsic-size:auto_260px] lg:[content-visibility:auto]">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold tracking-tight text-white sm:text-2xl">
          Similar artists
        </h2>
        <span className="text-xs capitalize text-[#6B7A75]">More {tag}</span>
      </div>

      {/* Below lg: scroll row. lg and up: 5-column grid. */}
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:p-0">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artist/${artist.id}`}
            prefetch={false}
            className="group flex w-28 shrink-0 flex-col items-center rounded-2xl border border-white/6 bg-surface p-3 text-center transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-white/16 hover:bg-elevated active:scale-[0.98] sm:w-32 lg:w-auto lg:p-4"
          >
            <div className="brand-gradient mb-2.5 h-20 w-20 rounded-full p-1 sm:h-24 sm:w-24 lg:mb-3 lg:h-32 lg:w-32">
              <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-[#0B0F0E] bg-elevated">
                <Image
                  src={artist.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 128px, 96px"
                  className="object-cover"
                />
              </div>
            </div>
            <h3 className="w-full truncate text-xs font-bold text-white transition-colors group-hover:text-[#4CD964] sm:text-sm">
              {artist.name}
            </h3>
            <p className="text-[11px] text-[#A3B1AC]">Artist</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
