import { Suspense } from "react";
import { notFound } from "next/navigation";
import { allGenres } from "@/lib/genres";
import { getTracksByGenre } from "@/lib/jamendo";
import TrackList from "@/components/TrackList";
import ListSkeleton from "@/components/ListSkeleton";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return allGenres.map((g) => ({ slug: g.slug }));
}

export default function GenrePage({ params }: { params: Params }) {
  return (
    <div className="py-4">
      <Suspense fallback={<ListSkeleton />}>
        <GenreContent params={params} />
      </Suspense>
    </div>
  );
}

async function GenreContent({ params }: { params: Params }) {
  const { slug } = await params;
  const genre = allGenres.find((g) => g.slug === slug);
  if (!genre) notFound();

  const tracks = await getTracksByGenre(genre.slug, 30).catch((err) => {
    console.error(`[genre/${genre.slug}] failed to load`, err);
    return [];
  });

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">
        {genre.name}
      </h1>
      {tracks.length === 0 ? (
        <p className="text-fg-2">Couldn&apos;t load tracks right now.</p>
      ) : (
        <TrackList tracks={tracks} />
      )}
    </>
  );
}
