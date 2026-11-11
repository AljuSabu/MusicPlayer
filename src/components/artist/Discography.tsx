import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Disc } from "lucide-react";
import { getArtistAlbums } from "@/lib/jamendo";

export type ReleaseFilter = "all" | "albums" | "singles";

const tabs: { id: ReleaseFilter; label: string }[] = [
  { id: "all", label: "All releases" },
  { id: "albums", label: "Albums" },
  { id: "singles", label: "Singles" },
];

export function parseReleaseFilter(value?: string): ReleaseFilter {
  return value === "albums" || value === "singles" ? value : "all";
}

export default function Discography({
  artistId,
  filter,
}: {
  artistId: string;
  filter: ReleaseFilter;
}) {
  const base = `/artist/${artistId}`;

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Discography
        </h2>

        <nav aria-label="Filter releases" className="flex items-center gap-2">
          {tabs.map((tab) => {
            const isActive = tab.id === filter;
            return (
              <Link
                key={tab.id}
                href={tab.id === "all" ? base : `${base}?releases=${tab.id}`}
                prefetch={false}
                replace
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                  isActive
                    ? "brand-gradient text-[#0B0F0E] shadow-[0_0_12px_rgba(76,217,100,0.3)]"
                    : "border border-white/8 bg-surface text-[#A3B1AC] hover:bg-elevated hover:text-white"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <Suspense fallback={<GridSkeleton />}>
        <ReleaseGrid artistId={artistId} filter={filter} />
      </Suspense>
    </section>
  );
}

async function ReleaseGrid({
  artistId,
  filter,
}: {
  artistId: string;
  filter: ReleaseFilter;
}) {
  const type =
    filter === "albums" ? "album" : filter === "singles" ? "single" : undefined;
  const releases = await getArtistAlbums(artistId, 18, {
    order: "releasedate_desc",
    type,
  }).catch(() => []);

  if (releases.length === 0) {
    return (
      <p className="rounded-2xl border border-white/6 bg-surface/40 p-6 text-center text-sm text-[#A3B1AC]">
        {filter === "all" ? "No releases yet." : `No ${filter} found.`}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {releases.map((release) => (
        <Link
          key={release.id}
          href={`/album/${release.id}`}
          prefetch={false}
          className="group rounded-2xl border border-white/6 bg-surface p-3 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-white/16 hover:bg-elevated"
        >
          <div className="relative mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-white/8 bg-elevated">
            {release.image ? (
              <Image
                src={release.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 14vw, (min-width: 768px) 22vw, 44vw"
                className="object-cover"
              />
            ) : (
              <Disc className="h-8 w-8 text-white/60" />
            )}
          </div>
          <h3 className="truncate text-xs font-bold text-white transition-colors group-hover:text-[#4CD964] sm:text-sm">
            {release.name}
          </h3>
          {release.releasedate && (
            <p className="mt-0.5 text-[11px] text-[#6B7A75]">
              {release.releasedate.slice(0, 4)}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-44 rounded-2xl border border-white/6 bg-surface"
        />
      ))}
    </div>
  );
}
