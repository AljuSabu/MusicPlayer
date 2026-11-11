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
    <section className="space-y-4 [contain-intrinsic-size:auto_260px] [content-visibility:auto]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Similar artists
        </h2>
        <span className="text-xs capitalize text-[#6B7A75]">More {tag}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artist/${artist.id}`}
            prefetch={false}
            className="group flex flex-col items-center rounded-2xl border border-white/6 bg-surface p-4 text-center transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-white/16 hover:bg-elevated"
          >
            <div className="brand-gradient mb-3 h-28 w-28 rounded-full p-1 sm:h-32 sm:w-32">
              <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-[#0B0F0E] bg-elevated">
                <Image
                  src={artist.image}
                  alt=""
                  fill
                  sizes="128px"
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
