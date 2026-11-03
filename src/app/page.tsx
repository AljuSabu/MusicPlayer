import { getTrendingTracks } from '@/lib/jamendo';
import TrackList from '@/components/TrackList';

export default async function HomePage() {
  const tracks = await getTrendingTracks(10);

  return (
    <div className="py-4">
      <h1 className="mb-6 text-3xl font-bold">Trending Now</h1>
      <TrackList tracks={tracks} />
    </div>
  );
}