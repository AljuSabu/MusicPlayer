import { getFeaturedTracks } from "@/lib/jamendo";
import type { Track } from "@/types/music";
import QuickTiles from "./QuickTiles";
import HeroBanner from "./HeroBanner";

export default async function FeaturedSection() {
  let tracks: Track[];
  try {
    tracks = await getFeaturedTracks(12);
  } catch {
    return (
      <p className="mb-10 text-sm text-fg-3">
        Couldn&apos;t load featured music right now.
      </p>
    );
  }
  if (tracks.length === 0) return null;

  return (
    <>
      <QuickTiles tracks={tracks} />
      <HeroBanner tracks={tracks} />
    </>
  );
}
