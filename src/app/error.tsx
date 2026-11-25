"use client";

import { startTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, RefreshCw, TriangleAlert } from "lucide-react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = () => {
    startTransition(() => {
      router.refresh(); // re-fetch server data
      reset(); // re-render the page
    });
  };

  return (
    <div
      role="alert"
      className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-warning/30 bg-warning/10 text-warning">
        <TriangleAlert className="h-7 w-7" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-[#A3B1AC]">
        We couldn&apos;t load this page. It&apos;s usually temporary, so try
        again in a moment.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-[11px] text-[#6B7A75]">
          Reference: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={retry}
          className="brand-gradient flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-[#0B0F0E] shadow-[0_0_20px_rgba(76,217,100,0.35)] transition-transform hover:scale-105 active:scale-95"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
        <Link
          href="/"
          className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-surface px-6 text-sm font-semibold text-white transition-colors hover:bg-elevated"
        >
          <Home className="h-4 w-4 text-[#4CD964]" />
          Go home
        </Link>
      </div>
    </div>
  );
}
