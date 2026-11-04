import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Track } from "@/types/music";
import TrackGrid from "./TrackGrid";

type Props = {
  title: string;
  load: () => Promise<Track[]>;
  href?: string; // optional "See all" link
};

export default async function ShelfSection({ title, load, href }: Props) {
  let tracks: Track[];
  try {
    tracks = await load();
  } catch {
    tracks = [];
  }
  if (tracks.length === 0) return null;

  return (
    <section className="mb-12 [contain-intrinsic-size:auto_340px] [content-visibility:auto]">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[22px] font-bold leading-7.5 tracking-tight text-white">
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            prefetch={false}
            className="group flex items-center gap-1 text-xs font-semibold text-[#A3B1AC] transition-colors hover:text-[#4CD964]"
          >
            <span>See all</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      <TrackGrid tracks={tracks} />
    </section>
  );
}
