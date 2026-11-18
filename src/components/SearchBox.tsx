"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchBox({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mirror the URL into the box when it changes from outside the box
  // (recent-search chips, links, Back/Forward). Skipped while typing.
  useEffect(() => {
    if (document.activeElement === inputRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const commit = (value: string) => {
    const trimmed = value.trim();
    if (trimmed === urlQuery) return;

    if (trimmed) {
      const url = `/search?q=${encodeURIComponent(trimmed)}`;
      // replace while already searching, so Back doesn't step through every keystroke
      if (pathname === "/search") router.replace(url);
      else router.push(url);
    } else if (pathname === "/search") {
      router.replace("/search");
    }
  };

  // Typing: wait 400ms, then update the URL
  const handleChange = (value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => commit(value), 400);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7A75]" />
      <input
        ref={inputRef}
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          if (timerRef.current) clearTimeout(timerRef.current);
          commit(query);
          inputRef.current?.blur(); // closes the phone keyboard
        }}
        placeholder="Search artists, tracks, playlists, genres..."
        aria-label="Search Vibra music streaming catalog"
        className="min-h-11 w-full rounded-full border border-white/8 bg-surface py-2.5 pl-11 pr-11 text-base text-white placeholder-[#6B7A75] transition-[border-color,box-shadow] duration-150 focus:border-[#4CD964] focus:outline-none focus:ring-2 focus:ring-[#4CD964]/20 md:text-sm"
      />
      {query && (
        <button
          onClick={() => {
            handleChange("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search text"
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#6B7A75] transition-colors hover:bg-white/8 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
