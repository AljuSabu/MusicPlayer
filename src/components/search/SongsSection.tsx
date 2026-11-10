import { searchTracks } from "@/lib/jamendo";
import SongResults from "./SongResults";

export default async function SongsSection({
  query,
  full,
}: {
  query: string;
  full: boolean;
}) {
  // 1 top result + 5 songs, or 1 + 20 when the Songs filter is active
  const tracks = await searchTracks(query, full ? 21 : 6).catch(() => []);

  if (tracks.length === 0) {
    return (
      <p className="text-sm text-[#A3B1AC]">
        No songs found for &ldquo;{query}&rdquo;.
      </p>
    );
  }
  return <SongResults tracks={tracks} full={full} />;
}
