import { Suspense } from "react";
import Greeting from "@/components/home/Greeting";
import FeaturedSection from "@/components/home/FeaturedSection";
import ShelfSection from "@/components/home/ShelfSection";
import GenreBrowseRow from "@/components/home/GenreBrowseRow";
import { FeaturedSkeleton, ShelfSkeleton } from "@/components/home/Skeletons";
import {
  getTrendingTracks,
  getNewReleases,
  getTracksByGenre,
} from "@/lib/jamendo";

export default function HomePage() {
  return (
    <div className="py-4">
      <Greeting />

      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedSection />
      </Suspense>

      <Suspense fallback={<ShelfSkeleton title="Trending Now" />}>
        <ShelfSection title="Trending Now" load={() => getTrendingTracks(5)} />
      </Suspense>

      <Suspense fallback={<ShelfSkeleton title="New Releases" />}>
        <ShelfSection title="New Releases" load={() => getNewReleases(5)} />
      </Suspense>

      <Suspense fallback={<ShelfSkeleton title="Recommended For You" />}>
        <ShelfSection
          title="Recommended For You"
          load={() => getTracksByGenre("electronic", 5)}
          href="/genre/electronic"
        />
      </Suspense>

      <GenreBrowseRow />
    </div>
  );
}
