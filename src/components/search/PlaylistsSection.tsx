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
    <section className="[contain-intrinsic-size:auto_280px] [content-visibility:auto]">
      <SectionHeader
        title="Playlists"
        subtitle="Community playlists"
        seeAllHref={
          full
            ? undefined
            : `/search?q=${encodeURIComponent(query)}&type=playlists`
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {playlists.map((playlist) => (
          <Link
            key={playlist.id}
            href={`/playlist/${playlist.id}`}
            prefetch={false}
            className="group rounded-[20px] border border-white/8 bg-surface p-4 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-1 hover:border-white/16 hover:bg-[#1B2421]"
          >
            <div
              className={`mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br ${
                gradients[(Number(playlist.id) || 0) % gradients.length]
              }`}
            >
              <Radio className="h-12 w-12 text-white/50" />
            </div>

            <h3 className="truncate text-sm font-bold tracking-tight text-white transition-colors group-hover:text-[#4CD964]">
              {playlist.name}
            </h3>
            {playlist.user_name && (
              <p className="mt-0.5 truncate text-xs text-[#A3B1AC]">
                by {playlist.user_name}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
