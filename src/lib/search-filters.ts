export type SearchFilter = "all" | "songs" | "artists" | "albums" | "playlists";

export const filterTabs: { id: SearchFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "songs", label: "Songs" },
  { id: "artists", label: "Artists" },
  { id: "albums", label: "Albums" },
  { id: "playlists", label: "Playlists" },
];

export function parseFilter(value?: string): SearchFilter {
  return filterTabs.some((t) => t.id === value)
    ? (value as SearchFilter)
    : "all";
}
