import { useEffect } from "react";
import { usePlayer } from "@/components/PlayerProvider";
import { registerTracks } from "@/lib/track-registry";
import type { Track } from "@/types/music";

export function useTrackPlayback(queue: Track[]) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  useEffect(() => {
    registerTracks(queue);
  }, [queue]);

  return {
    currentId: currentTrack?.id ?? null,
    isPlaying,
    toggle: (track: Track) =>
      currentTrack?.id === track.id ? togglePlay() : playTrack(track, queue),
  };
}
