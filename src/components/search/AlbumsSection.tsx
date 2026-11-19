import Image from "next/image";
import Link from "next/link";
import { Disc } from "lucide-react";
import { searchAlbums } from "@/lib/jamendo";
import SectionHeader from "./SectionHeader";

const shelfLayout =
  "no-scrollbar -mx-4 flex gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:p-0";
const gridLayout =
  "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6";

export default async function AlbumsSection({
  query,
  full,
}: {
  query: string;
  full: boolean;
}) {
  const albums = await searchAlbums(query, full ? 20 : 4).catch(() => []);

  if (albums.length === 0) {
    return full ? (
      <p className="text-sm text-[#A3B1AC]">No albums found.</p>
    ) : null;
  }

  return (
    <section className="lg:[contain-intrinsic-size:auto_320px] lg:[content-visibility:auto]">
      <SectionHeader
        title="Albums"
        subtitle="Full-length releases and EPs"
        seeAllHref={
          full
            ? undefined
            : `/search?q=${encodeURIComponent(query)}&type=albums`
        }
      />

      <div className={full ? gridLayout : shelfLayout}>
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/album/${album.id}`}
            prefetch={false}
            className={`group rounded-[20px] border border-white/8 bg-surface p-2.5 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-white/16 hover:bg-[#1B2421] active:scale-[0.98] lg:p-4 ${
              full ? "" : "w-32 shrink-0 sm:w-36 lg:w-auto"
            }`}
          >
            <div className="relative mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#1B2421] lg:mb-3 lg:rounded-2xl">
              {album.image ? (
                <Image
                  src={album.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 22vw, 144px"
                  className="object-cover"
                />
              ) : (
                <Disc className="h-10 w-10 text-white/50 lg:h-12 lg:w-12" />
              )}
            </div>

            <h3 className="truncate text-xs font-bold tracking-tight text-white transition-colors group-hover:text-[#4CD964] lg:text-sm">
              {album.name}
            </h3>
            <p className="mt-0.5 truncate text-[11px] text-[#A3B1AC] lg:text-xs">
              {album.releasedate ? `${album.releasedate.slice(0, 4)} • ` : ""}
              {album.artist_name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
