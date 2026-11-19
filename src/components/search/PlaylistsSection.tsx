import Link from "next/link";
import { Radio } from "lucide-react";
import { searchPlaylists } from "@/lib/jamendo";
import SectionHeader from "./SectionHeader";

// Jamendo playlists don't come with cover art, so each gets a brand gradient
const gradients = [
  "from-[#A6E23A]/60 to-[#1BC5A0]/30",
  "from-[#4CD964]/50 to-[#0B0F0E]",
  "from-[#1BC5A0]/60 to-[#131A18]",
  "from-[#7BC62D]/50 to-[#1B2421]",
];

const shelfLayout =
  "no-scrollbar -mx-4 flex gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:p-0";
const gridLayout =
  "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6";

export default async function PlaylistsSection({
  query,
  full,
}: {
  query: string;
  full: boolean;
}) {
  const playlists = await searchPlaylists(query, full ? 20 : 4).catch(() => []);

  if (playlists.length === 0) {
    return full ? (
      <p className="text-sm text-[#A3B1AC]">No playlists found.</p>
    ) : null;
  }

  return (
    <section className="lg:[contain-intrinsic-size:auto_280px] lg:[content-visibility:auto]">
      <SectionHeader
        title="Playlists"
        subtitle="Community playlists"
        seeAllHref={
          full
            ? undefined
            : `/search?q=${encodeURIComponent(query)}&type=playlists`
        }
      />

      <div className={full ? gridLayout : shelfLayout}>
        {playlists.map((playlist) => (
          <Link
            key={playlist.id}
            href={`/playlist/${playlist.id}`}
            prefetch={false}
            className={`group rounded-[20px] border border-white/8 bg-surface p-2.5 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-white/16 hover:bg-[#1B2421] active:scale-[0.98] lg:p-4 ${
              full ? "" : "w-32 shrink-0 sm:w-36 lg:w-auto"
            }`}
          >
            <div
              className={`mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-linear-to-br lg:mb-3 lg:rounded-2xl ${
                gradients[(Number(playlist.id) || 0) % gradients.length]
              }`}
            >
              <Radio className="h-10 w-10 text-white/50 lg:h-12 lg:w-12" />
            </div>

            <h3 className="truncate text-xs font-bold tracking-tight text-white transition-colors group-hover:text-[#4CD964] lg:text-sm">
              {playlist.name}
            </h3>
            {playlist.user_name && (
              <p className="mt-0.5 truncate text-[11px] text-[#A3B1AC] lg:text-xs">
                by {playlist.user_name}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
