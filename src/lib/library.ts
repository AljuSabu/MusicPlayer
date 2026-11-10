import type { Track } from "@/types/music";

export type LibraryFilter = "all" | "playlists" | "artists" | "albums";
export type LibrarySort = "recent" | "alphabetical" | "creator";
export type LibraryItemType = "playlist" | "artist" | "album";

export type LibraryItem = {
  id: string;
  type: LibraryItemType;
  title: string;
  creator?: string;
  countLabel: string;
  image: string;
  href: string;
  tracks: Track[]; // the liked songs that belong to this item
  rank: number; // lower = liked more recently
};

export const LIKED_ID = "liked";

export const libraryFilters: { id: LibraryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "playlists", label: "Playlists" },
  { id: "artists", label: "Artists" },
  { id: "albums", label: "Albums" },
];

export const sortLabels: Record<LibrarySort, string> = {
  recent: "Recently liked",
  alphabetical: "Alphabetical",
  creator: "Creator",
};

export const artistImageUrl = (artistId: string, size = 300) =>
  `https://usercontent.jamendo.com?type=artist&id=${artistId}&width=${size}`;

const songsLabel = (n: number) => `${n} liked ${n === 1 ? "song" : "songs"}`;

/** `tracks` must be ordered newest-liked first. */
export function buildLibrary(tracks: Track[]) {
  const artistMap = new Map<string, LibraryItem>();
  const albumMap = new Map<string, LibraryItem>();

  tracks.forEach((track, index) => {
    const artist = artistMap.get(track.artist_id);
    if (artist) {
      artist.tracks.push(track);
    } else {
      artistMap.set(track.artist_id, {
        id: `artist-${track.artist_id}`,
        type: "artist",
        title: track.artist_name,
        countLabel: "",
        image: artistImageUrl(track.artist_id),
        href: `/artist/${track.artist_id}`,
        tracks: [track],
        rank: index,
      });
    }

    // Singles have no album, so skip them
    if (track.album_id) {
      const album = albumMap.get(track.album_id);
      if (album) {
        album.tracks.push(track);
      } else {
        albumMap.set(track.album_id, {
          id: `album-${track.album_id}`,
          type: "album",
          title: track.album_name,
          creator: track.artist_name,
          countLabel: "",
          image: track.image,
          href: `/album/${track.album_id}`,
          tracks: [track],
          rank: index + 0.5,
        });
      }
    }
  });

  const finish = (map: Map<string, LibraryItem>) =>
    [...map.values()].map((item) => ({
      ...item,
      countLabel: songsLabel(item.tracks.length),
    }));

  const liked: LibraryItem | null =
    tracks.length > 0
      ? {
          id: LIKED_ID,
          type: "playlist",
          title: "Liked Songs",
          creator: "You",
          countLabel: songsLabel(tracks.length),
          image: "",
          href: "/liked",
          tracks,
          rank: -1,
        }
      : null;

  return { liked, artists: finish(artistMap), albums: finish(albumMap) };
}

const collator = new Intl.Collator(undefined, { sensitivity: "base" });

export function sortItems(items: LibraryItem[], sort: LibrarySort) {
  const list = [...items];
  if (sort === "alphabetical") {
    return list.sort((a, b) => collator.compare(a.title, b.title));
  }
  if (sort === "creator") {
    return list.sort(
      (a, b) =>
        collator.compare(a.creator ?? a.title, b.creator ?? b.title) ||
        collator.compare(a.title, b.title),
    );
  }
  return list.sort((a, b) => a.rank - b.rank);
}
