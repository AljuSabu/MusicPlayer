import Image from "next/image";
import Link from "next/link";
import { Disc } from "lucide-react";
import { searchAlbums } from "@/lib/jamendo";
import SectionHeader from "./SectionHeader";

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
    <section className="[contain-intrinsic-size:auto_320px] [content-visibility:auto]">
      <SectionHeader
        title="Albums"
        subtitle="Full-length releases and EPs"
        seeAllHref={
          full
            ? undefined
            : `/search?q=${encodeURIComponent(query)}&type=albums`
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/album/${album.id}`}
            prefetch={false}
            className="group rounded-[20px] border border-white/8 bg-surface p-4 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-white/16 hover:bg-[#1B2421]"
          >
            <div className="relative mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#1B2421]">
              {album.image ? (
                <Image
                  src={album.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 22vw, 44vw"
                  className="object-cover"
                />
              ) : (
                <Disc className="h-12 w-12 text-white/50" />
              )}
            </div>

            <h3 className="truncate text-sm font-bold tracking-tight text-white transition-colors group-hover:text-[#4CD964]">
              {album.name}
            </h3>
            <p className="mt-0.5 truncate text-xs text-[#A3B1AC]">
              {album.releasedate ? `${album.releasedate.slice(0, 4)} • ` : ""}
              {album.artist_name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
