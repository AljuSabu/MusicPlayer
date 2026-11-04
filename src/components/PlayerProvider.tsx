"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { Track } from "@/types/music";

type PlayerContextValue = {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  audioRef: RefObject<HTMLAudioElement | null>;
  playTrack: (track: Track, queue?: Track[]) => void;
  playAt: (index: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  isLiked: (id: string) => boolean;
  toggleLike: (id: string) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [queue, setQueue] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(78);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const currentTrack = queueIndex >= 0 ? (queue[queueIndex] ?? null) : null;
  const trackId = currentTrack?.id;
  const trackSrc = currentTrack?.audio;
  const duration = currentTrack?.duration ?? 0;

  // Load and play whenever the current track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !trackSrc) return;
    audio.src = trackSrc;
    audio.play().catch(() => setIsPlaying(false));
  }, [trackId, trackSrc]);

  // Keep the audio element's volume in sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // Load liked songs from the browser on first render
  useEffect(() => {
    try {
      const raw = localStorage.getItem("vibra:liked");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLikedIds(JSON.parse(raw));
    } catch {
      // ignore storage errors
    }
  }, []);

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => setIsPlaying(false));
  }, []);

  const playTrack = useCallback(
    (track: Track, newQueue?: Track[]) => {
      if (track.id === currentTrack?.id) {
        audioRef.current?.play().catch(() => setIsPlaying(false));
        return;
      }
      const list = newQueue && newQueue.length > 0 ? newQueue : [track];
      const index = Math.max(
        0,
        list.findIndex((t) => t.id === track.id),
      );
      setQueue(list);
      setQueueIndex(index);
    },
    [currentTrack?.id],
  );

  const playAt = useCallback((index: number) => setQueueIndex(index), []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !trackSrc) return;
    if (audio.paused) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [trackSrc]);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    if (queue.length === 1) {
      restart();
      return;
    }
    let target = (queueIndex + 1) % queue.length;
    if (isShuffle) {
      do {
        target = Math.floor(Math.random() * queue.length);
      } while (target === queueIndex);
    }
    setQueueIndex(target);
  }, [queue.length, queueIndex, isShuffle, restart]);

  const prev = useCallback(() => {
    if (queue.length === 0) return;
    const audio = audioRef.current;
    // Like most players: restart the song if it's been playing for a few seconds
    if ((audio && audio.currentTime > 3) || queue.length === 1) {
      restart();
      return;
    }
    setQueueIndex((queueIndex - 1 + queue.length) % queue.length);
  }, [queue.length, queueIndex, restart]);

  const seek = useCallback((seconds: number) => {
    if (audioRef.current) audioRef.current.currentTime = seconds;
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    if (value > 0) setIsMuted(false);
  }, []);

  const toggleLike = useCallback((id: string) => {
    setLikedIds((prevIds) => {
      const updated = prevIds.includes(id)
        ? prevIds.filter((x) => x !== id)
        : [...prevIds, id];
      try {
        localStorage.setItem("vibra:liked", JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  }, []);

  const handleEnded = () => {
    if (isRepeat) restart();
    else if (!isShuffle && queueIndex === queue.length - 1)
      return; // end of queue
    else next();
  };

  const value: PlayerContextValue = {
    currentTrack,
    queue,
    queueIndex,
    isPlaying,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    audioRef,
    playTrack,
    playAt,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleMute: () => setIsMuted((m) => !m),
    toggleShuffle: () => setIsShuffle((s) => !s),
    toggleRepeat: () => setIsRepeat((r) => !r),
    isLiked: (id) => likedIds.includes(id),
    toggleLike,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}

/** Current playback time. Only components that call this re-render on each tick. */
export function useAudioTime() {
  const { audioRef } = usePlayer();
  const [time, setTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => setTime(audio.currentTime);
    const events = ["timeupdate", "seeked", "emptied", "loadstart"] as const;
    events.forEach((e) => audio.addEventListener(e, update));
    return () => events.forEach((e) => audio.removeEventListener(e, update));
  }, [audioRef]);

  return time;
}
