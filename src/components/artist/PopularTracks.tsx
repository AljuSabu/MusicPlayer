"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Play } from "lucide-react";
import type { Track } from "@/types/music";
import { usePlayer } from "@/components/PlayerProvider";
import { useTrackPlayback } from "@/lib/use-track-playback";
import { formatTime } from "@/lib/utils";

export default function PopularTracks({
  tracks,
  visible = 5,
}: {
  tracks: Track[];
  visible?: number;
}) {
  const { currentId, isPlaying, toggle } = useTrackPlayback(tracks);
  const { isLiked, toggleLike } = usePlayer();

  return (
    <ul className="space-y-1 rounded-[20px] border border-white/6 bg-surface/60 p-2 sm:p-3">
      {tracks.slice(0, visible).map((track, i) => {
        const isCurrent = currentId === track.id;
        const showPause = isCurrent && isPlaying;
        const liked = isLiked(track.id);

        return (
          <li
            key={track.id}
            onClick={() => toggle(track)}
            className={`group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors sm:px-4 ${
              isCurrent ? "bg-elevated" : "hover:bg-white/4"
            }`}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(track);
                }}
                aria-label={`${showPause ? "Pause" : "Play"} ${track.name}`}
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

              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/8 bg-elevated">
                <Image
                  src={track.image}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 pr-2">
                <p
                  className={`truncate text-sm font-semibold ${
                    isCurrent ? "text-[#4CD964]" : "text-white"
                  }`}
                >
                  {track.name}
                </p>
                {track.album_id && track.album_name ? (
                  <Link
                    href={`/album/${track.album_id}`}
                    prefetch={false}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-block max-w-full truncate align-top text-xs text-[#6B7A75] hover:text-white hover:underline"
                  >
                    {track.album_name}
                  </Link>
                ) : (
                  <span className="text-xs text-[#6B7A75]">Single</span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4 pl-3 sm:gap-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(track.id);
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
              <span className="w-10 text-right font-mono text-xs text-[#A3B1AC]">
                {formatTime(track.duration)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
