'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Volume2,
  VolumeX,
  Mic2,
  ListMusic,
  Maximize2,
  Music,
} from 'lucide-react';
import { usePlayer } from '@/components/PlayerProvider';
import { formatTime } from '@/lib/utils';

export default function PlayerBar() {
  const {
    currentTrack,
    queue,
    queueIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    playAt,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    isLiked,
    toggleLike,
  } = usePlayer();

  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [showQueueModal, setShowQueueModal] = useState(false);

  const hasTrack = currentTrack !== null;
  const liked = hasTrack && isLiked(currentTrack.id);
  const progressPercent =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const upNext = queue.slice(queueIndex + 1, queueIndex + 5);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasTrack) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(Math.round(pos * duration));
  };

  return (
    <footer
      aria-label="Vibra Master Player"
      className="relative z-50 col-span-2 flex h-22 select-none items-center justify-between border-t border-white/8 bg-surface/90 px-4 shadow-[0_-12px_36px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:px-6"
    >
      {/* 1. Left Section: cover, title, artist, heart */}
      <div className="flex w-60 min-w-0 items-center gap-3.5 sm:w-70">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-linear-to-br from-[#4CD964]/30 to-[#1BC5A0]/10 shadow-md">
          {hasTrack ? (
            <Image
              src={currentTrack.image}
              alt={currentTrack.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <Music className="h-5 w-5 text-white/70" />
          )}

          {/* Equalizer bars over the cover while playing */}
          {isPlaying && (
            <div className="absolute inset-0 flex items-end justify-center gap-0.5 bg-black/50 pb-2">
              <span className="animate-eq-1 w-1 rounded-full bg-[#4CD964]" />
              <span className="animate-eq-2 w-1 rounded-full bg-[#A6E23A]" />
              <span className="animate-eq-3 w-1 rounded-full bg-[#1BC5A0]" />
              <span className="animate-eq-4 w-1 rounded-full bg-[#4CD964]" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="cursor-pointer truncate text-xs font-bold text-white hover:underline sm:text-sm">
            {hasTrack ? currentTrack.name : 'Nothing playing'}
          </h4>
          <p className="mt-0.5 cursor-pointer truncate text-[11px] text-[#A3B1AC] hover:text-white sm:text-xs">
            {hasTrack ? currentTrack.artist_name : 'Pick a track to start'}
          </p>
        </div>

        <button
          onClick={() => hasTrack && toggleLike(currentTrack.id)}
          disabled={!hasTrack}
          aria-label={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          className={`shrink-0 rounded-full p-1.5 transition-colors duration-150 disabled:opacity-40 ${
            liked ? 'text-[#4CD964]' : 'text-[#6B7A75] hover:text-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-[#4CD964]' : ''}`} />
        </button>
      </div>

      {/* 2. Center Section: controls and seek bar */}
      <div className="flex max-w-2xl flex-1 flex-col items-center justify-center px-4 sm:px-8">
        <div className="mb-1.5 flex items-center gap-4 sm:gap-6">
          <button
            onClick={toggleShuffle}
            aria-label="Shuffle playback"
            className={`p-1 transition-colors duration-150 ${
              isShuffle ? 'text-[#4CD964]' : 'text-[#6B7A75] hover:text-white'
            }`}
          >
            <Shuffle className="h-4 w-4" />
          </button>

          <button
            onClick={prev}
            disabled={!hasTrack}
            aria-label="Previous track"
            className="p-1 text-[#A3B1AC] transition-colors duration-150 hover:text-white disabled:opacity-40"
          >
            <SkipBack className="h-4 w-4 fill-current sm:h-5 sm:w-5" />
          </button>

          <button
            onClick={togglePlay}
            disabled={!hasTrack}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="brand-gradient flex h-10 w-10 items-center justify-center rounded-full text-[#0B0F0E] shadow-[0_0_24px_rgba(76,217,100,0.45)] transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 sm:h-11 sm:w-11"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-[#0B0F0E] sm:h-5 sm:w-5" />
            ) : (
              <Play className="ml-0.5 h-4 w-4 fill-[#0B0F0E] sm:h-5 sm:w-5" />
            )}
          </button>

          <button
            onClick={next}
            disabled={!hasTrack}
            aria-label="Next track"
            className="p-1 text-[#A3B1AC] transition-colors duration-150 hover:text-white disabled:opacity-40"
          >
            <SkipForward className="h-4 w-4 fill-current sm:h-5 sm:w-5" />
          </button>

          <button
            onClick={toggleRepeat}
            aria-label="Repeat playback"
            className={`p-1 transition-colors duration-150 ${
              isRepeat ? 'text-[#4CD964]' : 'text-[#6B7A75] hover:text-white'
            }`}
          >
            <Repeat className="h-4 w-4" />
          </button>
        </div>

        {/* Seek bar */}
        <div className="flex w-full items-center gap-3 font-mono text-[11px] text-[#6B7A75]">
          <span className="w-9 text-right tabular-nums">{formatTime(currentTime)}</span>

          <div
            onClick={handleSeek}
            role="progressbar"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Seek track position"
            className="group relative flex h-3 flex-1 cursor-pointer items-center py-1"
          >
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-[#1B2421]">
              <div
                className="brand-gradient h-full rounded-full transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div
              className="pointer-events-none absolute top-1/2 -ml-1.5 h-3 w-3 -translate-y-1/2 scale-0 rounded-full bg-white shadow-[0_0_8px_#4CD964] transition-transform duration-150 group-hover:scale-100"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="w-9 text-left tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Right Section: lyrics, queue, volume, expand */}
      <div className="flex w-60 items-center justify-end gap-3 sm:w-70 sm:gap-4">
        <button
          onClick={() => setShowLyricsModal(!showLyricsModal)}
          aria-label="Toggle Lyrics"
          className={`rounded-full p-1.5 transition-colors duration-150 ${
            showLyricsModal ? 'text-[#4CD964]' : 'text-[#A3B1AC] hover:text-white'
          }`}
        >
          <Mic2 className="h-4 w-4" />
        </button>

        <button
          onClick={() => setShowQueueModal(!showQueueModal)}
          aria-label="Toggle Playback Queue"
          className={`rounded-full p-1.5 transition-colors duration-150 ${
            showQueueModal ? 'text-[#4CD964]' : 'text-[#A3B1AC] hover:text-white'
          }`}
        >
          <ListMusic className="h-4 w-4" />
        </button>

        <div className="group flex items-center gap-2">
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute volume' : 'Mute volume'}
            className="p-1 text-[#A3B1AC] transition-colors duration-150 hover:text-white"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4 text-error" />
            ) : (
              <Volume2 className="h-4 w-4 text-[#4CD964]" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume level slider"
            className="h-1 w-16 cursor-pointer rounded-full bg-[#1B2421] accent-[#4CD964] sm:w-20"
          />
        </div>

        <button
          aria-label="Expand player view"
          className="rounded-full p-1.5 text-[#A3B1AC] transition-colors duration-150 hover:bg-white/4 hover:text-white"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Lyrics panel (placeholder) */}
      {showLyricsModal && (
        <div className="absolute bottom-24 right-6 z-50 w-80 space-y-2 rounded-2xl border border-white/10 bg-surface p-5 text-xs shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-white/8 pb-2 font-bold text-white">
            <Mic2 className="h-3.5 w-3.5 text-[#4CD964]" />
            <span>Lyrics</span>
          </div>
          <p className="py-4 text-center text-[#A3B1AC]">
            Lyrics aren&apos;t available yet.
          </p>
        </div>
      )}

      {/* Queue panel (real data) */}
      {showQueueModal && (
        <div className="absolute bottom-24 right-16 z-50 w-80 space-y-3 rounded-2xl border border-white/10 bg-surface p-5 text-xs shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/8 pb-2">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <ListMusic className="h-3.5 w-3.5 text-[#4CD964]" />
              <span>Play Queue</span>
            </span>
            <span className="text-[10px] text-[#A3B1AC]">
              Next: {upNext.length} {upNext.length === 1 ? 'track' : 'tracks'}
            </span>
          </div>

          {upNext.length === 0 ? (
            <p className="py-3 text-center text-[#6B7A75]">Nothing up next.</p>
          ) : (
            <div className="space-y-2">
              {upNext.map((track, i) => (
                <button
                  key={track.id}
                  onClick={() => playAt(queueIndex + 1 + i)}
                  className="flex w-full items-center gap-2.5 rounded-lg bg-[#0B0F0E] p-2 text-left transition-colors hover:bg-[#1B2421]"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-white/4 text-[#6B7A75]">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-white">{track.name}</div>
                    <div className="truncate text-[10px] text-[#6B7A75]">
                      {track.artist_name}
                    </div>
                  </div>
                  <span className="font-mono text-[#6B7A75]">
                    {formatTime(track.duration)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </footer>
  );
}