"use client";

import { RefreshCw } from "lucide-react";

export default function LoadError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-4 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning"
    >
      <span>{message}</span>
      <button
        onClick={onRetry}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-warning/40 px-3 py-1 text-xs font-semibold transition-colors hover:bg-warning/10"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </button>
    </div>
  );
}
