"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { usePlayer, useAudioTime } from "@/components/PlayerProvider";
import { formatTime, licenseCode, resizeJamendoImage } from "@/lib/utils";

export default function NowPlayingView({ onClose }: { onClose: () => void }) {
  const {
    currentTrack,
    queue,
    queueIndex,
    isPlaying,
    isShuffle,
    isRepeat,
    togglePlay,
    next,
    prev,
    toggleShuffle,
    toggleRepeat,
    playAt,
    isLiked,
    toggleLike,
  } = usePlayer();

  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus the close button when the view opens
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Escape closes the view
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!currentTrack) return null;

  const track = currentTrack;
  const liked = isLiked(track.id);
  const upNext = queue.slice(queueIndex + 1, queueIndex + 6);
  const license = track.license_ccurl;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Now playing"
      className="animate-fadeIn fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#0B0F0E] selection:bg-[#4CD964]/30 selection:text-white"
    >
      {/* Background: a tiny cover stretched to fill the screen gives a soft
          colour wash with no blur filters. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        <Image
          key={track.id}
          src={resizeJamendoImage(track.image, 50)}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0B0F0E]/70 via-[#0B0F0E]/85 to-[#0B0F0E]" />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-[1fr_auto_1fr] items-center px-6 py-5">
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close full-screen player"
          className="flex w-fit items-center gap-2 rounded-full border border-white/8 bg-surface px-3.5 py-2 text-[#A3B1AC] transition-[color,background-color,border-color,transform] duration-150 hover:border-white/20 hover:bg-elevated hover:text-white active:scale-95"
        >
          <ChevronDown className="h-4 w-4" />
          <span className="text-xs font-semibold">Collapse</span>
        </button>

        <div className="text-center">
          <span className="block font-mono text-[11px] uppercase tracking-widest text-[#6B7A75]">
            Playing from
          </span>
          <span className="block max-w-48 truncate text-xs font-bold tracking-tight text-white sm:max-w-xs sm:text-sm">
            {track.album_name || "Single"}
          </span>
        </div>

        <div />
      </header>

      {/* Main: cover, title, wave, seek, controls */}
      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-6 py-4">
        {/* Cover scales with screen height so everything fits on laptops */}
        <div className="relative h-[min(20rem,32vh)] min-h-48 w-[min(20rem,32vh)] min-w-48 overflow-hidden rounded-3xl border-2 border-white/12 bg-elevated shadow-[0_0_64px_-10px_rgba(76,217,100,0.35)]">
          <Image
            key={track.id}
            src={resizeJamendoImage(track.image, 500)}
            alt={`${track.album_name || track.name} cover`}
            fill
            priority
            sizes="320px"
            className="object-cover"
          />
        </div>

        {/* Title, artist, heart, licence */}
        <div className="w-full space-y-2 text-center">
          <div className="flex items-center justify-center gap-3">
            <h2 className="min-w-0 truncate text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {track.name}
            </h2>
            <button
              onClick={() => toggleLike(track.id)}
              aria-label={
                liked ? "Remove from Liked Songs" : "Save to Liked Songs"
              }
              className={`shrink-0 rounded-full p-2 transition-[color,transform] duration-150 active:scale-90 ${
                liked ? "text-[#4CD964]" : "text-[#6B7A75] hover:text-white"
              }`}
            >
              <Heart className={`h-6 w-6 ${liked ? "fill-[#4CD964]" : ""}`} />
            </button>
          </div>

          <Link
            href={`/artist/${track.artist_id}`}
            prefetch={false}
            onClick={onClose}
            className="inline-block text-base font-medium text-[#A3B1AC] transition-colors hover:text-white hover:underline sm:text-lg"
          >
            {track.artist_name}
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            {license && (
              <a
                href={license}
                target="_blank"
                rel="noopener noreferrer"
                title="Creative Commons licence"
                className="inline-flex items-center gap-1 rounded border border-white/10 bg-surface px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wider text-white transition-colors hover:border-white/30"
              >
                <span className="rounded bg-elevated px-1 font-bold text-[#4CD964]">
                  CC
                </span>
                <span>{licenseCode(license) ?? "Licence"}</span>
              </a>
            )}
            {track.album_id && track.album_name && (
              <>
                {license && <span className="text-[#6B7A75]">·</span>}
                <Link
                  href={`/album/${track.album_id}`}
                  prefetch={false}
                  onClick={onClose}
                  className="max-w-56 truncate text-[#A3B1AC] transition-colors hover:text-white hover:underline"
                >
                  {track.album_name}
                </Link>
              </>
            )}
          </div>
        </div>

        <PulseWave playing={isPlaying} />

        <NowPlayingSeek />

        {/* Controls */}
        <div className="flex w-full items-center justify-center gap-6 pt-2 sm:gap-8">
          <button
            onClick={toggleShuffle}
            aria-label="Shuffle"
            aria-pressed={isShuffle}
            className={`p-2 transition-colors duration-150 ${
              isShuffle ? "text-[#4CD964]" : "text-[#6B7A75] hover:text-white"
            }`}
          >
            <Shuffle className="h-5 w-5" />
          </button>

          <button
            onClick={prev}
            aria-label="Previous track"
            className="flex h-12 w-12 items-center justify-center rounded-full text-[#A3B1AC] transition-[color,background-color,transform] hover:bg-white/6 hover:text-white active:scale-95"
          >
            <SkipBack className="h-6 w-6 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="brand-gradient flex h-16 w-16 items-center justify-center rounded-full text-[#0B0F0E] shadow-[0_0_36px_rgba(76,217,100,0.55)] transition-transform duration-150 hover:scale-105 active:scale-95 sm:h-18 sm:w-18"
          >
            {isPlaying ? (
              <Pause className="h-7 w-7 fill-[#0B0F0E]" />
            ) : (
              <Play className="ml-1 h-7 w-7 fill-[#0B0F0E]" />
            )}
          </button>

          <button
            onClick={next}
            aria-label="Next track"
            className="flex h-12 w-12 items-center justify-center rounded-full text-[#A3B1AC] transition-[color,background-color,transform] hover:bg-white/6 hover:text-white active:scale-95"
          >
            <SkipForward className="h-6 w-6 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            aria-label="Repeat"
            aria-pressed={isRepeat}
            className={`p-2 transition-colors duration-150 ${
              isRepeat ? "text-[#4CD964]" : "text-[#6B7A75] hover:text-white"
            }`}
          >
            <Repeat className="h-5 w-5" />
          </button>
        </div>
      </main>

      {/* Up next */}
      <footer className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-6 pt-2">
        <section
          aria-label="Up next"
          className="max-h-56 overflow-y-auto rounded-[20px] border border-white/8 bg-surface p-4 sm:p-5"
        >
          <div className="mb-2 flex items-center justify-between border-b border-white/6 pb-2 font-mono text-xs text-[#6B7A75]">
            <span className="flex items-center gap-1.5 uppercase">
              <ListMusic className="h-3.5 w-3.5 text-[#4CD964]" />
              Up next
            </span>
            <span>
              {upNext.length} {upNext.length === 1 ? "track" : "tracks"}
            </span>
          </div>

          {upNext.length === 0 ? (
            <p className="py-4 text-center text-sm text-[#6B7A75]">
              Nothing up next.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {upNext.map((item, i) => (
                <li key={item.id}>
                  <button
                    onClick={() => playAt(queueIndex + 1 + i)}
                    className="group flex w-full items-center justify-between rounded-[10px] border border-white/4 bg-[#0B0F0E]/40 p-2.5 text-left transition-colors hover:border-white/12 hover:bg-elevated"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="w-5 text-center font-mono text-xs text-[#6B7A75]">
                        {i + 1}
                      </span>
                      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-white/8 bg-elevated">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-bold text-white transition-colors group-hover:text-[#4CD964]">
                          {item.name}
                        </span>
                        <span className="block truncate text-[11px] text-[#A3B1AC]">
                          {item.artist_name}
                        </span>
                      </span>
                    </span>
                    <span className="font-mono text-xs text-[#6B7A75]">
                      {formatTime(item.duration)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </footer>
    </div>
  );
}

/* ---------- Seek bar: the only part that updates every tick ---------- */

function NowPlayingSeek() {
  const { currentTrack, duration, seek } = usePlayer();
  const time = useAudioTime();
  const progress = duration > 0 ? Math.min(100, (time / duration) * 100) : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentTrack) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(Math.round(pos * duration));
  };

  return (
    <div className="w-full space-y-2 pt-2">
      <div
        onClick={handleSeek}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Seek track timeline"
        className="group relative flex h-4 w-full cursor-pointer items-center"
      >
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-elevated">
          <div
            className="brand-gradient h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div
          className="pointer-events-none absolute top-1/2 -ml-2 h-4 w-4 -translate-y-1/2 scale-90 rounded-full bg-white shadow-[0_0_10px_#4CD964] transition-transform group-hover:scale-110"
          style={{ left: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-0.5 font-mono text-xs tabular-nums text-[#6B7A75]">
        <span>{formatTime(time)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

/* ---------- Pulse line from the Vibra logo, animated with CSS only ---------- */

function PulseWave({ playing }: { playing: boolean }) {
  const d =
    "M 0 35 C 80 35, 140 35, 200 35 L 220 30 L 240 50 L 260 12 L 280 58 L 300 22 L 320 42 C 360 35, 450 35, 600 35";

  return (
    <div aria-hidden="true" className="h-14 w-full max-w-xl">
      <svg
        viewBox="0 0 600 70"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="np-wave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A6E23A" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#4CD964" />
            <stop offset="100%" stopColor="#1BC5A0" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <line
          x1="0"
          y1="35"
          x2="600"
          y2="35"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          vectorEffect="non-scaling-stroke"
        />

        {/* Paused = frozen in place; reduced-motion users get a still wave */}
        <g
          className="animate-pulse-wave motion-reduce:animate-none"
          style={{ animationPlayState: playing ? "running" : "paused" }}
        >
          {/* Soft glow made from a wide, faint stroke (no blur filter) */}
          <path
            d={d}
            stroke="url(#np-wave)"
            strokeOpacity="0.2"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={d}
            stroke="url(#np-wave)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
}
