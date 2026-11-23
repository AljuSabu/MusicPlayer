import Image from "next/image";
import Link from "next/link";
import { Disc } from "lucide-react";
import { getArtistAlbums } from "@/lib/jamendo";

export default async function MoreByArtist({
  artistId,
  artistName,
  currentAlbumId,
}: {
  artistId: string;
  artistName: string;
  currentAlbumId: string;
}) {
  const albums = (await getArtistAlbums(artistId, 8).catch(() => []))
    .filter((a) => a.id !== currentAlbumId)
    .slice(0, 5);

  if (albums.length === 0) return null;

  return (
    <section className="space-y-3 border-t border-white/8 pt-5 lg:space-y-4 lg:pt-6 lg:[contain-intrinsic-size:auto_300px] lg:[content-visibility:auto]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold tracking-tight text-white sm:text-xl">
            More by {artistName}
          </h2>
          <p className="mt-0.5 hidden text-xs text-[#A3B1AC] sm:block">
            More releases from this artist
          </p>
        </div>
        <Link
          href={`/artist/${artistId}`}
          prefetch={false}
          className="-my-2 shrink-0 py-2 text-xs font-semibold text-[#4CD964] hover:underline"
        >
          See discography
        </Link>
      </div>

      {/* Phones and tablets: scroll row. lg and up: 5-column grid. */}
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:p-0">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/album/${album.id}`}
            prefetch={false}
            className="group w-32 shrink-0 rounded-[20px] border border-white/8 bg-surface p-2.5 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-white/16 hover:bg-elevated active:scale-[0.98] sm:w-36 lg:w-auto lg:p-4"
          >
            <div className="relative mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-elevated lg:mb-3 lg:rounded-2xl">
              {album.image ? (
                <Image
                  src={album.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 17vw, 144px"
                  className="object-cover"
                />
              ) : (
                <Disc className="h-8 w-8 text-white/40 lg:h-10 lg:w-10" />
              )}
            </div>
            <h3 className="truncate text-xs font-bold tracking-tight text-white transition-colors group-hover:text-[#4CD964] lg:text-sm">
              {album.name}
            </h3>
            {album.releasedate && (
              <p className="mt-0.5 truncate text-[11px] text-[#A3B1AC] lg:text-xs">
                {album.releasedate.slice(0, 4)}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
