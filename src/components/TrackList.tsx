"use client";

import Image from "next/image";
import { Play, Pause, Heart } from "lucide-react";
import type { Track } from "@/types/music";
import { usePlayer } from "@/components/PlayerProvider";
import { formatTime } from "@/lib/utils";

export default function TrackList({ tracks }: { tracks: Track[] }) {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    isLiked,
    toggleLike,
  } = usePlayer();

  return (
    <ul className="space-y-2">
      {tracks.map((track) => {
        const isCurrent = currentTrack?.id === track.id;
        return (
          <li
            key={track.id}
            className={`flex items-center gap-4 rounded-xl p-3 transition-colors ${
              isCurrent ? "bg-elevated" : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <Image
              src={track.image}
              alt={track.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p
                className={`truncate font-semibold ${isCurrent ? "text-brand" : ""}`}
              >
                {track.name}
              </p>
              <p className="truncate text-sm text-fg-2">{track.artist_name}</p>
            </div>
            <span className="font-mono text-xs text-fg-3">
              {formatTime(track.duration)}
            </span>
            <button
              onClick={() => toggleLike(track.id)}
              aria-label={
                isLiked(track.id)
                  ? "Remove from Liked Songs"
                  : "Save to Liked Songs"
              }
              className={`p-1.5 transition-colors ${
                isLiked(track.id)
                  ? "text-[#4CD964]"
                  : "text-[#6B7A75] hover:text-white"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${isLiked(track.id) ? "fill-[#4CD964]" : ""}`}
              />
            </button>
            <button
              onClick={() =>
                isCurrent ? togglePlay() : playTrack(track, tracks)
              }
              aria-label={isCurrent && isPlaying ? "Pause" : "Play"}
              className="brand-gradient flex h-10 w-10 items-center justify-center rounded-full text-[#0B0F0E]"
            >
              {isCurrent && isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
