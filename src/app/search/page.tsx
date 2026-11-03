import { searchTracks } from '@/lib/jamendo';
import TrackList from '@/components/TrackList';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';
  const tracks = query ? await searchTracks(query, 20) : [];

  return (
    <div className="py-4">
      {!query ? (
        <>
          <h1 className="mb-2 text-3xl font-bold">Search</h1>
          <p className="text-fg-2">Type in the search bar to find tracks, artists or genres.</p>
        </>
      ) : (
        <>
          <h1 className="mb-6 text-3xl font-bold">
            Results for <span className="brand-gradient-text">&ldquo;{query}&rdquo;</span>
          </h1>
          {tracks.length === 0 ? (
            <p className="text-fg-2">No results found. Try a different search.</p>
          ) : (
            <TrackList tracks={tracks} />
          )}
        </>
      )}
    </div>
  );
}