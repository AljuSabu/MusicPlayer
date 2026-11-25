import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="brand-gradient-text font-mono text-7xl font-bold tracking-tight sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        This track isn&apos;t in the library
      </h1>
      <p className="mt-2 max-w-md text-sm text-[#A3B1AC]">
        The page you were looking for doesn&apos;t exist, or it may have been
        moved. Let&apos;s get you back to the music.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="brand-gradient flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-[#0B0F0E] shadow-[0_0_20px_rgba(76,217,100,0.35)] transition-transform hover:scale-105 active:scale-95"
        >
          <Home className="h-4 w-4" />
          Go home
        </Link>
        <Link
          href="/search"
          className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-surface px-6 text-sm font-semibold text-white transition-colors hover:bg-elevated"
        >
          <Compass className="h-4 w-4 text-[#4CD964]" />
          Browse music
        </Link>
      </div>
    </div>
  );
}
