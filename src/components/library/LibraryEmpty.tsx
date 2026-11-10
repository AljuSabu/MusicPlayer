import Link from "next/link";
import { Compass, FolderHeart, Sparkles } from "lucide-react";

export default function LibraryEmpty() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border border-white/6 bg-surface/40 px-4 py-10 text-center">
      <div className="relative flex h-28 w-28 items-center justify-center rounded-full">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(76,217,100,0.22),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-1 rounded-full border border-dashed border-[#4CD964]/40"
        />
        <div className="relative z-10 flex h-18 w-18 items-center justify-center rounded-full border border-white/10 bg-surface shadow-2xl">
          <FolderHeart className="h-8 w-8 stroke-[1.5] text-[#4CD964]" />
        </div>
        <div className="brand-gradient absolute bottom-1 right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full text-[#0B0F0E]">
          <Sparkles className="h-3.5 w-3.5 fill-current" />
        </div>
      </div>

      <div className="max-w-md space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Your library is empty
        </h2>
        <p className="text-xs leading-relaxed text-[#A3B1AC] sm:text-sm">
          Tap the heart on songs you love. They&apos;ll appear here, along with
          their artists and albums.
        </p>
      </div>

      <Link
        href="/search"
        className="brand-gradient flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-[#0B0F0E] shadow-[0_0_20px_rgba(76,217,100,0.35)] transition-transform hover:scale-105 active:scale-95 sm:text-sm"
      >
        <Compass className="h-4 w-4 stroke-[2.5]" />
        <span>Find music</span>
      </Link>
    </div>
  );
}
