import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getArtistProfile, getArtistPopularTracks } from "@/lib/jamendo";
import ArtistHero from "@/components/artist/ArtistHero";
import PopularTracks from "@/components/artist/PopularTracks";
import Discography, {
  parseReleaseFilter,
} from "@/components/artist/Discography";
import SimilarArtists from "@/components/artist/SimilarArtists";
import ArtistSkeleton from "@/components/artist/ArtistSkeleton";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ releases?: string }>;

export default function ArtistPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  return (
    <div className="py-4">
      <Suspense fallback={<ArtistSkeleton />}>
        <ArtistContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ArtistContent({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const [{ id }, { releases }] = await Promise.all([params, searchParams]);

  // Artist ids are numbers; reject anything else before it reaches the API
  if (!/^\d+$/.test(id)) notFound();

  // Profile and top tracks load in parallel
  const result = await Promise.all([
    getArtistProfile(id),
    getArtistPopularTracks(id, 10),
  ]).catch(() => null);
  if (!result) {
    return (
      <p className="text-[#A3B1AC]">
        Couldn&apos;t load this artist right now. Try again.
      </p>
    );
  }

  const [artist, popular] = result;
  if (!artist) notFound();

  const tag = artist.tags[0];

  return (
    <div className="space-y-12 pb-16">
      <ArtistHero artist={artist} queue={popular} />

      {popular.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Popular
          </h2>
          <PopularTracks tracks={popular} />
        </section>
      )}

      <Discography artistId={artist.id} filter={parseReleaseFilter(releases)} />

      {tag && (
        <Suspense fallback={null}>
          <SimilarArtists tag={tag} excludeId={artist.id} />
        </Suspense>
      )}
    </div>
  );
}
