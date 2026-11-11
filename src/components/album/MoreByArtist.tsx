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
    <section className="space-y-4 border-t border-white/8 pt-6 [contain-intrinsic-size:auto_300px] [content-visibility:auto]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            More by {artistName}
          </h2>
          <p className="mt-0.5 text-xs text-[#A3B1AC]">
            More releases from this artist
          </p>
        </div>
        <Link
          href={`/artist/${artistId}`}
          prefetch={false}
          className="text-xs font-semibold text-[#4CD964] hover:underline"
        >
          See discography
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-5">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/album/${album.id}`}
            prefetch={false}
            className="group rounded-[20px] border border-white/8 bg-surface p-4 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-white/16 hover:bg-elevated"
          >
            <div className="relative mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-elevated">
              {album.image ? (
                <Image
                  src={album.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 17vw, (min-width: 640px) 28vw, 44vw"
                  className="object-cover"
                />
              ) : (
                <Disc className="h-10 w-10 text-white/40" />
              )}
            </div>
            <h3 className="truncate text-sm font-bold tracking-tight text-white transition-colors group-hover:text-[#4CD964]">
              {album.name}
            </h3>
            {album.releasedate && (
              <p className="mt-0.5 truncate text-xs text-[#A3B1AC]">
                {album.releasedate.slice(0, 4)}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
