import { usePlayer } from "@/components/PlayerProvider";
import type { Track } from "@/types/music";

export function useTrackPlayback(queue: Track[]) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  return {
    currentId: currentTrack?.id ?? null,
    isPlaying,
    toggle: (track: Track) =>
      currentTrack?.id === track.id ? togglePlay() : playTrack(track, queue),
  };
}
