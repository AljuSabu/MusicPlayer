"use client";

import { Play, Pause } from "lucide-react";
import type { Track } from "@/types/music";
import { usePlayer } from "@/components/PlayerProvider";

export default function HeroPlayButton({ tracks }: { tracks: Track[] }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const heroIsLoaded =
    !!currentTrack && tracks.some((t) => t.id === currentTrack.id);
  const showPause = heroIsLoaded && isPlaying;

  const handleClick = () => {
    if (heroIsLoaded) togglePlay();
    else playTrack(tracks[0], tracks);
  };

  return (
    <button
      onClick={handleClick}
      className="brand-gradient flex items-center gap-2.5 rounded-full px-6 py-3 text-xs font-bold text-[#0B0F0E] shadow-[0_0_24px_rgba(76,217,100,0.45)] transition-[transform,opacity] duration-150 hover:opacity-95 active:scale-95 sm:text-sm"
    >
      {showPause ? (
        <>
          <Pause className="h-4 w-4 fill-[#0B0F0E]" />
          <span>Pause</span>
        </>
      ) : (
        <>
          <Play className="h-4 w-4 fill-[#0B0F0E]" />
          <span>Play Featured</span>
        </>
      )}
    </button>
  );
}
