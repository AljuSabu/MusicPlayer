import Image from "next/image";
import Link from "next/link";
import { Heart, Play, Pause } from "lucide-react";
import { LIKED_ID, type LibraryItem } from "@/lib/library";

type Props = {
  items: LibraryItem[];
  isItemPlaying: (item: LibraryItem) => boolean;
  onPlay: (item: LibraryItem) => void;
};

export default function LibraryGrid({ items, isItemPlaying, onPlay }: Props) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) =>
        item.id === LIKED_ID ? (
          <LikedCard
            key={item.id}
            item={item}
            playing={isItemPlaying(item)}
            onPlay={onPlay}
          />
        ) : (
          <ItemCard
            key={item.id}
            item={item}
            playing={isItemPlaying(item)}
            onPlay={onPlay}
          />
        ),
      )}
    </div>
  );
}

function LikedCard({
  item,
  playing,
  onPlay,
}: {
  item: LibraryItem;
  playing: boolean;
  onPlay: (item: LibraryItem) => void;
}) {
  return (
    <div className="group relative col-span-2 overflow-hidden rounded-[20px] bg-linear-to-br from-[#A6E23A] via-[#4CD964] to-[#1BC5A0] text-[#0B0F0E] shadow-[0_8px_24px_rgba(76,217,100,0.25)] transition-transform duration-300 hover:-translate-y-1">
      <Link
        href={item.href}
        prefetch={false}
        className="relative flex h-full min-h-44 flex-col justify-between p-6"
      >
        <Heart
          aria-hidden="true"
          className="absolute right-4 top-4 h-24 w-24 fill-current stroke-none text-[#0B0F0E]/15"
        />

        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-[#0B0F0E]/20">
          <Heart className="h-6 w-6 fill-white text-white" />
        </div>

        <div className="relative pt-10">
          <h2 className="text-2xl font-bold tracking-tight">Liked Songs</h2>
          <p className="mt-1 text-xs font-semibold text-[#0B0F0E]/80">
            {item.countLabel}
          </p>
        </div>
      </Link>

      <button
        onClick={() => onPlay(item)}
        aria-label={playing ? "Pause Liked Songs" : "Play Liked Songs"}
        className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#0B0F0E] shadow-xl transition-transform hover:scale-105 active:scale-95"
      >
        {playing ? (
          <Pause className="h-5 w-5 fill-[#4CD964] text-[#4CD964]" />
        ) : (
          <Play className="ml-0.5 h-5 w-5 fill-[#4CD964] text-[#4CD964]" />
        )}
      </button>
    </div>
  );
}

function ItemCard({
  item,
  playing,
  onPlay,
}: {
  item: LibraryItem;
  playing: boolean;
  onPlay: (item: LibraryItem) => void;
}) {
  const isArtist = item.type === "artist";

  return (
    <div className="group rounded-2xl border border-white/6 bg-surface p-3.5 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-white/16 hover:bg-elevated">
      <div className="relative mb-3">
        <Link
          href={item.href}
          prefetch={false}
          aria-label={item.title}
          className={`block aspect-square w-full overflow-hidden ${
            isArtist
              ? "brand-gradient rounded-full p-1"
              : "rounded-xl border border-white/8"
          }`}
        >
          <span
            className={`relative block h-full w-full overflow-hidden bg-elevated ${
              isArtist ? "rounded-full" : ""
            }`}
          >
            <Image
              src={item.image}
              alt=""
              fill
              sizes="(min-width: 1280px) 15vw, (min-width: 768px) 22vw, 44vw"
              className="object-cover"
            />
          </span>
        </Link>

        <button
          onClick={() => onPlay(item)}
          aria-label={`${playing ? "Pause" : "Play"} ${item.title}`}
          className={`brand-gradient absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-full text-[#0B0F0E] shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-[opacity,transform] duration-200 ${
            playing
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
          }`}
        >
          {playing ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          )}
        </button>
      </div>

      <Link
        href={item.href}
        prefetch={false}
        className="block min-w-0 space-y-1"
      >
        <h3 className="truncate text-xs font-bold text-white transition-colors group-hover:text-[#4CD964] sm:text-sm">
          {item.title}
        </h3>
        <p className="flex items-center gap-1.5 truncate text-[11px] text-[#6B7A75]">
          <span className="capitalize">{item.type}</span>
          <span>•</span>
          <span className="truncate">{item.countLabel}</span>
        </p>
      </Link>
    </div>
  );
}
