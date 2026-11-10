"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Heart, Sparkles } from "lucide-react";
import type { Track } from "@/types/music";
import { usePlayer } from "@/components/PlayerProvider";
import { useTrackPlayback } from "@/lib/use-track-playback";
import { formatTime } from "@/lib/utils";

/* ---------- Shared song list (used by both tabs) ---------- */

type SongListProps = {
  songs: Track[];
  currentId: string | null;
  isPlaying: boolean;
  onToggle: (track: Track) => void;
  isLiked: (id: string) => boolean;
  onLike: (id: string) => void;
};

function SongList({
  songs,
  currentId,
  isPlaying,
  onToggle,
  isLiked,
  onLike,
}: SongListProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Songs</h2>
        <span className="text-xs text-[#6B7A75]">
          {songs.length} matching tracks
        </span>
      </div>

      <ul className="flex flex-1 flex-col gap-1.5">
        {songs.map((song, i) => {
          const isCurrent = currentId === song.id;
          const showPause = isCurrent && isPlaying;
          const liked = isLiked(song.id);

          return (
            <li
              key={song.id}
              onClick={() => onToggle(song)}
              className={`group flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                isCurrent
                  ? "border-[#4CD964]/40 bg-[#1B2421]"
                  : "border-transparent bg-surface/60 hover:border-white/8 hover:bg-[#1B2421]"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(song);
                  }}
                  aria-label={`${showPause ? "Pause" : "Play"} ${song.name}`}
                  className="w-6 shrink-0 text-center font-mono text-xs text-[#6B7A75]"
                >
                  {showPause ? (
                    <span className="flex h-5 items-end justify-center gap-0.5">
                      <span className="animate-eq-1 w-1 rounded-full bg-[#4CD964]" />
                      <span className="animate-eq-2 w-1 rounded-full bg-[#A6E23A]" />
                      <span className="animate-eq-3 w-1 rounded-full bg-[#1BC5A0]" />
                    </span>
                  ) : (
                    <>
                      <span
                        className={`group-hover:hidden ${isCurrent ? "text-[#4CD964]" : ""}`}
                      >
                        {i + 1}
                      </span>
                      <Play className="mx-auto hidden h-3.5 w-3.5 fill-current text-white group-hover:block" />
                    </>
                  )}
                </button>

                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[10px] border border-white/8 bg-[#1B2421]">
                  <Image
                    src={song.image}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h3
                    className={`truncate text-sm font-semibold ${
                      isCurrent ? "text-[#4CD964]" : "text-white"
                    }`}
                  >
                    {song.name}
                  </h3>
                  <p className="truncate text-xs text-[#A3B1AC]">
                    {song.artist_name}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-4 pl-3">
                {song.album_id && song.album_name && (
                  <Link
                    href={`/album/${song.album_id}`}
                    prefetch={false}
                    onClick={(e) => e.stopPropagation()}
                    className="hidden max-w-35 truncate text-xs text-[#6B7A75] hover:text-white hover:underline sm:inline-block"
                  >
                    {song.album_name}
                  </Link>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike(song.id);
                  }}
                  aria-label={
                    liked ? "Remove from Liked Songs" : "Save to Liked Songs"
                  }
                  className={`rounded-full p-1.5 transition-colors ${
                    liked ? "text-[#4CD964]" : "text-[#6B7A75] hover:text-white"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                </button>

                <span className="w-9 text-right font-mono text-xs text-[#A3B1AC]">
                  {formatTime(song.duration)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- Main component ---------- */

export default function SongResults({
  tracks,
  full,
}: {
  tracks: Track[];
  full: boolean;
}) {
  const { currentId, isPlaying, toggle } = useTrackPlayback(tracks);
  const { isLiked, toggleLike } = usePlayer();

  // Songs tab: just the list, no top result card
  if (full) {
    return (
      <SongList
        songs={tracks}
        currentId={currentId}
        isPlaying={isPlaying}
        onToggle={toggle}
        isLiked={isLiked}
        onLike={toggleLike}
      />
    );
  }

  // All tab: top result card + 5 songs (same as before)
  const [top, ...songs] = tracks;
  const topShowsPause = currentId === top.id && isPlaying;
  const topLiked = isLiked(top.id);

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
      {/* Top result */}
      <div className="flex flex-col lg:col-span-5">
        <h2 className="mb-4 text-xl font-bold text-white">Top result</h2>

        <div className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-white/8 bg-surface p-6 sm:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(76,217,100,0.18),transparent_70%)]"
          />

          <div className="relative">
            <div className="relative mb-6 h-28 w-28 overflow-hidden rounded-2xl border border-white/12 bg-[#1B2421] sm:h-32 sm:w-32">
              <Image
                src={top.image}
                alt=""
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>

            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#4CD964]/30 bg-[#4CD964]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#4CD964]">
              <Sparkles className="h-3 w-3" />
              <span>Song</span>
            </div>

            <h3 className="line-clamp-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {top.name}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#A3B1AC] sm:text-sm">
              <Link
                href={`/artist/${top.artist_id}`}
                prefetch={false}
                className="font-semibold text-white hover:underline"
              >
                {top.artist_name}
              </Link>
              {top.album_id && top.album_name && (
                <>
                  <span>•</span>
                  <Link
                    href={`/album/${top.album_id}`}
                    prefetch={false}
                    className="hover:text-white hover:underline"
                  >
                    {top.album_name}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="relative mt-8 flex items-center justify-between border-t border-white/8 pt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggle(top)}
                aria-label={
                  topShowsPause ? "Pause top result" : "Play top result"
                }
                className="brand-gradient flex h-14 w-14 items-center justify-center rounded-full text-[#0B0F0E] shadow-[0_0_20px_rgba(76,217,100,0.45)] transition-transform hover:scale-105 active:scale-95"
              >
                {topShowsPause ? (
                  <Pause className="h-6 w-6 fill-current" />
                ) : (
                  <Play className="h-6 w-6 translate-x-0.5 fill-current" />
                )}
              </button>

              <button
                onClick={() => toggleLike(top.id)}
                aria-label={
                  topLiked ? "Remove from Liked Songs" : "Save to Liked Songs"
                }
                className={`rounded-full border p-3 transition-colors hover:bg-white/5 ${
                  topLiked
                    ? "border-[#4CD964]/30 text-[#4CD964]"
                    : "border-white/8 text-[#A3B1AC] hover:text-white"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${topLiked ? "fill-current" : ""}`}
                />
              </button>
            </div>

            <span className="font-mono text-xs text-[#6B7A75]">
              {formatTime(top.duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Songs list */}
      {songs.length > 0 && (
        <div className="flex flex-col lg:col-span-7">
          <SongList
            songs={songs}
            currentId={currentId}
            isPlaying={isPlaying}
            onToggle={toggle}
            isLiked={isLiked}
            onLike={toggleLike}
          />
        </div>
      )}
    </div>
  );
}