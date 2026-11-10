import { Suspense } from "react";
import { parseFilter, type SearchFilter } from "@/lib/search-filters";
import RecentSearches from "@/components/search/RecentSearches";
import SaveRecentSearch from "@/components/search/SaveRecentSearch";
import BrowseAll from "@/components/search/BrowseAll";
import FilterChips from "@/components/search/FilterChips";
import SongsSection from "@/components/search/SongsSection";
import ArtistsSection from "@/components/search/ArtistsSection";
import AlbumsSection from "@/components/search/AlbumsSection";
import PlaylistsSection from "@/components/search/PlaylistsSection";
import { SongsSkeleton } from "@/components/search/Skeletons";
import { ShelfSkeleton } from "@/components/home/Skeletons";

type SearchParams = Promise<{ q?: string; type?: string }>;

export default function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="py-4">
      <Suspense fallback={<SongsSkeleton />}>
        <SearchContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function SearchContent({ searchParams }: { searchParams: SearchParams }) {
  const { q, type } = await searchParams;
  const query = q?.trim() ?? "";

  // State A: nothing typed yet
  if (!query) {
    return (
      <div className="space-y-10">
        <h1 className="sr-only">Search</h1>
        <RecentSearches />
        <BrowseAll />
      </div>
    );
  }

  // State B: results
  const filter = parseFilter(type);
  const full = filter !== "all";
  const show = (section: SearchFilter) =>
    filter === "all" || filter === section;

  return (
    <>
      <SaveRecentSearch query={query} />

      <h1 className="mb-6 text-3xl font-bold">
        Results for{" "}
        <span className="brand-gradient-text">&ldquo;{query}&rdquo;</span>
      </h1>

      <FilterChips query={query} active={filter} />

      <div className="space-y-10">
        {show("songs") && (
          <Suspense fallback={<SongsSkeleton />}>
            <SongsSection query={query} full={full} />
          </Suspense>
        )}
        {show("artists") && (
          <Suspense fallback={<ShelfSkeleton title="Artists" />}>
            <ArtistsSection query={query} full={full} />
          </Suspense>
        )}
        {show("albums") && (
          <Suspense fallback={<ShelfSkeleton title="Albums" />}>
            <AlbumsSection query={query} full={full} />
          </Suspense>
        )}
        {show("playlists") && (
          <Suspense fallback={<ShelfSkeleton title="Playlists" />}>
            <PlaylistsSection query={query} full={full} />
          </Suspense>
        )}
      </div>
    </>
  );
}
