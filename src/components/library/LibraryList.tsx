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
    <div className="space-y-1 rounded-[20px] border border-white/6 bg-surface/60 p-2 sm:p-3">
      {items.map((item) => {
        const isLikedRow = item.id === LIKED_ID;
        const isArtist = item.type === "artist";
        const playing = isItemPlaying(item);

        return (
          <div
            key={item.id}
            className={`group flex items-center rounded-xl transition-colors hover:bg-white/4 ${
              isLikedRow
                ? "bg-linear-to-r from-[#4CD964]/10 to-transparent"
                : ""
            }`}
          >
            <Link
              href={item.href}
              prefetch={false}
              className="flex min-w-0 flex-1 items-center gap-3.5 px-3 py-2.5 sm:px-4"
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
              <div className="min-w-0 flex-1 pr-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white transition-colors group-hover:text-[#4CD964]">
                  <span className="truncate">{item.title}</span>
                  {isLikedRow && (
                    <span className="brand-gradient shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-[#0B0F0E]">
                      Pinned
                    </span>
                  )}
                </div>
                <div className="truncate text-xs text-[#6B7A75]">
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

            <button
              onClick={() => onPlay(item)}
              aria-label={`${playing ? "Pause" : "Play"} ${item.title}`}
              className={`mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors sm:mr-4 ${
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
            </button>
          </div>
        );
      })}
    </div>
  );
}
