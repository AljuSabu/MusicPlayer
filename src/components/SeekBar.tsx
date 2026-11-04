"use client";

import { usePlayer, useAudioTime } from "@/components/PlayerProvider";
import { formatTime } from "@/lib/utils";

export default function SeekBar() {
  const { currentTrack, duration, seek } = usePlayer();
  const currentTime = useAudioTime();

  const hasTrack = currentTrack !== null;
  const progress =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasTrack) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(Math.round(pos * duration));
  };

  return (
    <div className="flex w-full items-center gap-3 font-mono text-[11px] text-[#6B7A75]">
      <span className="w-9 text-right tabular-nums">
        {formatTime(currentTime)}
      </span>

      <div
        onClick={handleSeek}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Seek track position"
        className="group relative flex h-3 flex-1 cursor-pointer items-center py-1"
      >
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-[#1B2421]">
          <div
            className="brand-gradient h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div
          className="pointer-events-none absolute top-1/2 -ml-1.5 h-3 w-3 -translate-y-1/2 scale-0 rounded-full bg-white shadow-[0_0_8px_#4CD964] transition-transform duration-150 group-hover:scale-100"
          style={{ left: `${progress}%` }}
        />
      </div>

      <span className="w-9 text-left tabular-nums">{formatTime(duration)}</span>
    </div>
  );
}
