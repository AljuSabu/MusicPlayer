import Image from "next/image";
import Link from "next/link";
import type { Album, Track } from "@/types/music";
import { artistImageUrl } from "@/lib/library";
import { formatLongDuration } from "@/lib/utils";

// "http://creativecommons.org/licenses/by-nc-sa/3.0/" -> "CC BY-NC-SA"
function licenseLabel(url: string) {
  const match = url.match(/licenses\/([a-z-]+)\//i);
  return match ? `CC ${match[1].toUpperCase()}` : "Creative Commons";
}

export default function AlbumHeader({
  album,
  tracks,
}: {
  album: Album;
  tracks: Track[];
}) {
  const totalSeconds = tracks.reduce((sum, t) => sum + t.duration, 0);
  const license = tracks[0]?.license_ccurl;
  const year = album.releasedate?.slice(0, 4);
  const label = tracks.length === 1 ? "Single" : "Album";

  return (
    <header className="flex flex-col items-center gap-6 pt-4 sm:gap-8 md:flex-row md:items-end">
      <div className="relative h-56 w-56 shrink-0 overflow-hidden rounded-[20px] border border-white/15 bg-elevated shadow-[0_16px_40px_rgba(0,0,0,0.6)] sm:h-60 sm:w-60">
        <Image
          src={album.image}
          alt={`${album.name} cover`}
          fill
          priority
          sizes="240px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-end text-center md:text-left">
        <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
          <span className="rounded-full border border-[#4CD964]/30 bg-[#4CD964]/15 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-[#4CD964]">
            {label}
          </span>
          {license && (
            <a
              href={license}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] font-bold text-[#A3B1AC] transition-colors hover:text-white"
            >
              {licenseLabel(license)}
            </a>
          )}
        </div>

        <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          {album.name}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#A3B1AC] sm:gap-2.5 sm:text-sm md:justify-start">
          <Link
            href={`/artist/${album.artist_id}`}
            prefetch={false}
            className="group/artist flex items-center gap-2"
          >
            <span className="relative h-7 w-7 overflow-hidden rounded-full border border-white/20 bg-elevated transition-colors group-hover/artist:border-[#4CD964]">
              <Image
                src={artistImageUrl(album.artist_id, 100)}
                alt=""
                fill
                sizes="28px"
                className="object-cover"
              />
            </span>
            <span className="font-bold text-white transition-colors group-hover/artist:text-[#4CD964]">
              {album.artist_name}
            </span>
          </Link>

          {year && (
            <>
              <span className="text-[#6B7A75]">•</span>
              <span className="font-medium text-white">{year}</span>
            </>
          )}
          <span className="text-[#6B7A75]">•</span>
          <span className="font-medium text-white">
            {tracks.length} {tracks.length === 1 ? "song" : "songs"}
          </span>
          <span className="text-[#6B7A75]">•</span>
          <span className="font-mono">{formatLongDuration(totalSeconds)}</span>
        </div>
      </div>
    </header>
  );
}
