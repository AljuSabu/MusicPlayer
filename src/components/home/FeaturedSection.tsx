import { getFeaturedTracks } from "@/lib/jamendo";
import type { Track } from "@/types/music";
import QuickTiles from "./QuickTiles";
import HeroBanner from "./HeroBanner";

export default async function FeaturedSection() {
  let tracks: Track[] = [];
  try {
    tracks = await getFeaturedTracks(12);
  } catch (err) {
    console.error("[FeaturedSection] failed to load", err); // shows up in Vercel Logs
  }

  if (tracks.length === 0) {
    return (
      <div className="mb-10 rounded-2xl border border-white/8 bg-surface p-6 text-sm text-[#A3B1AC]">
        Couldn&apos;t load featured music right now. Try refreshing in a moment.
      </div>
    );
  }

  return (
    <>
      <QuickTiles tracks={tracks} />
      <HeroBanner tracks={tracks} />
    </>
  );
}
