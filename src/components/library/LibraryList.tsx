import Image from "next/image";
import Link from "next/link";
import { Heart, Play, Pause } from "lucide-react";
import { LIKED_ID, type LibraryItem } from "@/lib/library";

type Props = {
  items: LibraryItem[];
  isItemPlaying: (item: LibraryItem) => boolean;
  onPlay: (item: LibraryItem) => void;
};

export default function LibraryList({ items, isItemPlaying, onPlay }: Props) {
  return (
    <div className="space-y-1 rounded-[20px] border border-white/6 bg-surface/60 p-1.5 sm:p-3">
      {items.map((item) => {
        const isLikedRow = item.id === LIKED_ID;
        const isArtist = item.type === "artist";
        const playing = isItemPlaying(item);

        return (
          <div
            key={item.id}
            className={`group flex min-h-12 items-center rounded-xl transition-colors hover:bg-white/4 ${
              isLikedRow
                ? "bg-linear-to-r from-[#4CD964]/10 to-transparent"
                : ""
            }`}
          >
            <Link
              href={item.href}
              prefetch={false}
              className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2 sm:gap-3.5 sm:px-4 sm:py-2.5"
            >
              {/* Thumbnail */}
              <div
                className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-white/8 ${
                  isArtist ? "rounded-full" : "rounded-lg"
                } ${isLikedRow ? "brand-gradient" : "bg-elevated"}`}
              >
                {isLikedRow ? (
                  <Heart className="h-5 w-5 fill-[#0B0F0E] text-[#0B0F0E]" />
                ) : (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                )}
              </div>

              {/* Name */}
              <div className="min-w-0 flex-1 pr-2 sm:pr-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-white transition-colors group-hover:text-[#4CD964] sm:text-sm">
                  <span className="truncate">{item.title}</span>
                  {isLikedRow && (
                    <span className="brand-gradient shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-[#0B0F0E]">
                      Pinned
                    </span>
                  )}
                </div>
                <div className="truncate text-[11px] text-[#6B7A75] sm:text-xs">
                  {/* Phones also show the type here, since the badge column is hidden */}
                  <span className="capitalize sm:hidden">{item.type} · </span>
                  {item.creator ?? item.countLabel}
                </div>
              </div>

              {/* Type badge */}
              <span className="hidden w-28 sm:block">
                <span className="inline-block rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-[10px] font-semibold capitalize text-[#A3B1AC]">
                  {item.type}
                </span>
              </span>

              {/* Count */}
              <span className="hidden pr-4 text-right font-mono text-xs text-[#A3B1AC] md:block">
                {item.countLabel}
              </span>
            </Link>

            {/* 44px tap target on phones, with the visible circle kept at 32px */}
            <button
              onClick={() => onPlay(item)}
              aria-label={`${playing ? "Pause" : "Play"} ${item.title}`}
              className="group/play flex h-11 w-11 shrink-0 items-center justify-center sm:mr-3"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  playing
                    ? "brand-gradient text-[#0B0F0E]"
                    : "bg-elevated text-[#A3B1AC] group-hover:brand-gradient group-hover:text-[#0B0F0E]"
                }`}
              >
                {playing ? (
                  <Pause className="h-3.5 w-3.5 fill-current" />
                ) : (
                  <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                )}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
