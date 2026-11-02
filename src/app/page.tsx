import { getTrendingTracks } from '@/lib/jamendo';

export default async function HomePage() {
  const tracks = await getTrendingTracks(8);

  return (
    <div className="py-4">
      <h1 className="mb-6 text-3xl font-bold">Trending Now</h1>

      <ul className="space-y-4">
        {tracks.map((track) => (
          <li key={track.id} className="flex items-center gap-4 rounded-xl bg-white/5 p-3">
            <img src={track.image} alt={track.name} className="h-16 w-16 rounded-lg" />
            <div className="flex-1">
              <p className="font-semibold">{track.name}</p>
              <p className="text-sm text-gray-400">{track.artist_name}</p>
            </div>
            <audio controls src={track.audio} preload="none" className="h-10" />
          </li>
        ))}
      </ul>
    </div>
  );
}
