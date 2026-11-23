"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { usePlayer } from "@/components/PlayerProvider";
import { useLikedTracks } from "@/lib/use-liked-tracks";
import {
  buildLibrary,
  sortItems,
  libraryFilters,
  type LibraryFilter,
  type LibraryItem,
  type LibrarySort,
} from "@/lib/library";
import SortMenu from "./SortMenu";
import LibraryGrid from "./LibraryGrid";
import LibraryList from "./LibraryList";
import LibraryEmpty from "./LibraryEmpty";
import LibrarySkeleton from "./LibrarySkeleton";
import LoadError from "@/components/LoadError";

type ViewMode = "grid" | "list";

const emptyNotes: Record<LibraryFilter, string> = {
  all: "Nothing here yet.",
  playlists: "No playlists yet.",
  artists:
    "No artists yet. Like a few songs and their artists will show up here.",
  albums:
    "No albums yet. Like songs that belong to an album and it will show up here.",
};

export default function LibraryView() {
  const { tracks, likedCount, ready, error, retry } = useLikedTracks();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const [filter, setFilter] = useState<LibraryFilter>("all");
  const [sort, setSort] = useState<LibrarySort>("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const library = useMemo(() => buildLibrary(tracks), [tracks]);

  const items = useMemo(() => {
    const { liked, artists, albums } = library;
    const rest =
      filter === "artists"
        ? artists
        : filter === "albums"
          ? albums
          : filter === "all"
            ? [...artists, ...albums]
            : [];
    const sorted = sortItems(rest, sort);

    // Liked Songs is always pinned first
    if (liked && (filter === "all" || filter === "playlists"))
      return [liked, ...sorted];
    return sorted;
  }, [library, filter, sort]);

  if (!ready) return <LibrarySkeleton />;

  const header = (
    <div className="border-b border-white/6 pb-3 sm:pb-4">
      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
        Your Library
      </h1>
      <p className="mt-1 text-xs text-[#A3B1AC]">
        Built from the songs you&apos;ve liked. Playlists are coming soon.
      </p>
      {likedCount > 0 && (
        <p className="mt-2 font-mono text-[11px] text-[#6B7A75]">
          {likedCount} liked songs · {library.artists.length} artists ·{" "}
          {library.albums.length} albums
        </p>
      )}
    </div>
  );

  if (likedCount === 0) {
    return (
      <div className="space-y-6 pb-4 sm:space-y-8 md:pb-16">
        {header}
        <LibraryEmpty />
      </div>
    );
  }

  const containsCurrent = (item: LibraryItem) =>
    !!currentTrack && item.tracks.some((t) => t.id === currentTrack.id);

  const isItemPlaying = (item: LibraryItem) =>
    isPlaying && containsCurrent(item);

  const handlePlay = (item: LibraryItem) => {
    if (containsCurrent(item)) togglePlay();
    else playTrack(item.tracks[0], item.tracks);
  };

  return (
    <div className="space-y-5 pb-4 sm:space-y-8 md:pb-16">
      {header}

      {error && (
        <LoadError
          message="Some of your liked songs couldn't be loaded, so parts of your library may be missing."
          onRetry={retry}
        />
      )}

      {/* Controls. Phones: chips on one row, sort + view toggle on the next.
          sm and up: one boxed bar. */}
      <div className="space-y-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:space-y-0 sm:rounded-2xl sm:border sm:border-white/6 sm:bg-surface/50 sm:p-3">
        <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0 sm:py-1">
          {libraryFilters.map(({ id, label }) => {
            const isActive = filter === id;
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                aria-pressed={isActive}
                className={`flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-xs font-semibold transition-colors duration-150 active:scale-95 sm:min-h-0 sm:py-1.5 ${
                  isActive
                    ? "brand-gradient text-[#0B0F0E] shadow-[0_0_12px_rgba(76,217,100,0.3)]"
                    : "border border-white/8 bg-surface text-[#A3B1AC] hover:bg-elevated hover:text-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 sm:ml-auto sm:justify-end">
          <SortMenu value={sort} onChange={setSort} />

          <div className="flex items-center rounded-full border border-white/8 bg-[#0B0F0E] p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors sm:h-8 sm:w-8 ${
                viewMode === "grid"
                  ? "bg-elevated text-[#4CD964]"
                  : "text-[#6B7A75] hover:text-white"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors sm:h-8 sm:w-8 ${
                viewMode === "list"
                  ? "bg-elevated text-[#4CD964]"
                  : "text-[#6B7A75] hover:text-white"
              }`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <p className="rounded-2xl border border-white/6 bg-surface/40 p-6 text-center text-sm text-[#A3B1AC] sm:p-8">
          {error
            ? "Couldn't load your library. Try refreshing."
            : emptyNotes[filter]}
        </p>
      ) : viewMode === "grid" ? (
        <LibraryGrid
          items={items}
          isItemPlaying={isItemPlaying}
          onPlay={handlePlay}
        />
      ) : (
        <LibraryList
          items={items}
          isItemPlaying={isItemPlaying}
          onPlay={handlePlay}
        />
      )}
    </div>
  );
}
