import { Suspense } from "react";
import { searchTracks } from "@/lib/jamendo";
import TrackList from "@/components/TrackList";
import ListSkeleton from "@/components/ListSkeleton";

type SearchParams = Promise<{ q?: string }>;

export default function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="py-4">
      <Suspense fallback={<ListSkeleton />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SearchResults({ searchParams }: { searchParams: SearchParams }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return (
      <>
        <h1 className="mb-2 text-3xl font-bold">Search</h1>
        <p className="text-fg-2">
          Type in the search bar to find tracks, artists or genres.
        </p>
      </>
    );
  }

  const tracks = await searchTracks(query, 20).catch(() => []);

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">
        Results for{" "}
        <span className="brand-gradient-text">&ldquo;{query}&rdquo;</span>
      </h1>
      {tracks.length === 0 ? (
        <p className="text-fg-2">No results found. Try a different search.</p>
      ) : (
        <TrackList tracks={tracks} />
      )}
    </>
  );
}
