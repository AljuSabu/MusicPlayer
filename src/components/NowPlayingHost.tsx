"use client";

import dynamic from "next/dynamic";
import { usePlayer } from "@/components/PlayerProvider";

const NowPlayingView = dynamic(() => import("@/components/NowPlayingView"), {
  ssr: false,
});

export default function NowPlayingHost() {
  const { nowPlayingOpen, closeNowPlaying, currentTrack } = usePlayer();
  if (!nowPlayingOpen || !currentTrack) return null;
  return <NowPlayingView onClose={closeNowPlaying} />;
}
