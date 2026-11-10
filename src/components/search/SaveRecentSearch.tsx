"use client";

import { useEffect } from "react";
import { addRecentSearch } from "@/lib/recent-searches";

// Saves a query only if it stays on screen for 1.5s, so half-typed
// words like "ch" and "chi" don't clutter the history.
export default function SaveRecentSearch({ query }: { query: string }) {
  useEffect(() => {
    const timer = setTimeout(() => addRecentSearch(query), 1500);
    return () => clearTimeout(timer);
  }, [query]);

  return null;
}
