import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAlbumWithTracks, type AlbumDetail } from "@/lib/jamendo";
import AlbumHeader from "@/components/album/AlbumHeader";
import AlbumActions from "@/components/album/AlbumActions";
import AlbumTrackList from "@/components/album/AlbumTrackList";
import MoreByArtist from "@/components/album/MoreByArtist";
import AlbumSkeleton from "@/components/album/AlbumSkeleton";

type Params = Promise<{ id: string }>;

export default function AlbumPage({ params }: { params: Params }) {
  return (
    <div className="py-4">
      <Suspense fallback={<AlbumSkeleton />}>
        <AlbumContent params={params} />
      </Suspense>
    </div>
  );
}

async function AlbumContent({ params }: { params: Params }) {
  const { id } = await params;

  // Album ids are numbers; reject anything else before it reaches the API
  if (!/^\d+$/.test(id)) notFound();

  let data: AlbumDetail | null;
  try {
    data = await getAlbumWithTracks(id);
  } catch {
    return (
      <p className="text-[#A3B1AC]">
        Couldn&apos;t load this album right now. Try again.
      </p>
    );
  }

  if (!data) notFound();
  const { album, tracks, shareurl } = data;

  if (tracks.length === 0) {
    return <p className="text-[#A3B1AC]">This album has no playable tracks.</p>;
  }

  return (
    <div className="relative pb-16">
      {/* Soft tint behind the header (a plain gradient, no blur filter) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-4 h-80 bg-linear-to-b from-[#1BC5A0]/20 via-[#4CD964]/8 to-transparent"
      />

      <div className="relative space-y-10">
        <AlbumHeader album={album} tracks={tracks} />
        <AlbumActions tracks={tracks} jamendoUrl={shareurl} />
        <AlbumTrackList tracks={tracks} />

        <Suspense fallback={null}>
          <MoreByArtist
            artistId={album.artist_id}
            artistName={album.artist_name}
            currentAlbumId={album.id}
          />
        </Suspense>
      </div>
    </div>
  );
}
