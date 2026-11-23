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
    <header className="flex flex-col items-center gap-4 pt-1 sm:gap-8 sm:pt-4 md:flex-row md:items-end">
      <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-[20px] border border-white/15 bg-elevated shadow-[0_16px_40px_rgba(0,0,0,0.6)] sm:h-60 sm:w-60">
        <Image
          src={album.image}
          alt={`${album.name} cover`}
          fill
          priority
          sizes="(min-width: 640px) 240px, 192px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 max-w-full flex-1 flex-col items-center justify-end text-center md:items-start md:text-left">
        <div className="mb-1.5 flex items-center justify-center gap-2 sm:mb-2 md:justify-start">
          <span className="rounded-full border border-[#4CD964]/30 bg-[#4CD964]/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#4CD964] sm:px-3 sm:py-1 sm:text-xs">
            {label}
          </span>
          {license && (
            <a
              href={license}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#A3B1AC] transition-colors hover:text-white sm:py-1"
            >
              {licenseLabel(license)}
            </a>
          )}
        </div>

        <h1 className="mb-2 text-xl font-extrabold leading-tight tracking-tight text-white sm:mb-4 sm:text-4xl lg:text-5xl">
          {album.name}
        </h1>

        <div className="flex flex-col items-center gap-0.5 text-xs text-[#A3B1AC] sm:text-sm md:flex-row md:flex-wrap md:gap-2.5">
          <Link
            href={`/artist/${album.artist_id}`}
            prefetch={false}
            className="group/artist -my-1 flex items-center gap-1.5 py-2 sm:gap-2"
          >
            <span className="relative h-5 w-5 overflow-hidden rounded-full border border-white/20 bg-elevated transition-colors group-hover/artist:border-[#4CD964] sm:h-7 sm:w-7">
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

          <span aria-hidden="true" className="hidden text-[#6B7A75] md:inline">
            •
          </span>

          <p className="flex flex-wrap items-center justify-center gap-x-1.5 font-mono text-[11px] text-[#6B7A75] md:gap-x-2.5 md:font-sans md:text-sm md:text-[#A3B1AC]">
            {year && (
              <>
                <span className="md:font-medium md:text-white">{year}</span>
                <span aria-hidden="true">•</span>
              </>
            )}
            <span className="md:font-medium md:text-white">
              {tracks.length} {tracks.length === 1 ? "song" : "songs"}
            </span>
            <span aria-hidden="true">•</span>
            <span className="md:font-mono">
              {formatLongDuration(totalSeconds)}
            </span>
          </p>
        </div>
      </div>
    </header>
  );
}
