"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery); // starts from the URL, e.g. after a refresh
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Clear the box when you leave the search page (e.g. click Home)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (pathname !== "/search") setQuery("");
  }, [pathname]);

  // Debounced search: wait 400ms after typing stops, then update the URL
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === urlQuery) return;

    const timer = setTimeout(() => {
      if (trimmed) {
        const url = `/search?q=${encodeURIComponent(trimmed)}`;
        // replace while already searching, so Back doesn't step through every keystroke
        if (pathname === "/search") router.replace(url);
        else router.push(url);
      } else if (pathname === "/search") {
        router.replace("/search");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, urlQuery, pathname, router]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative z-40 flex h-16 shrink-0 items-center justify-between gap-6 border-b border-white/8 bg-[#0B0F0E] px-6 sm:px-8">
      {/* Left Section: Back/Forward Circular Buttons */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-surface text-[#A3B1AC] transition-colors duration-150 hover:border-white/20 hover:bg-[#1B2421] hover:text-white active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => router.forward()}
          aria-label="Go forward"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-surface text-[#A3B1AC] transition-colors duration-150 hover:border-white/20 hover:bg-[#1B2421] hover:text-white active:scale-95"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Center: Large Pill-Shaped Search Input */}
      <div className="mx-auto max-w-xl flex-1">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7A75]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artists, tracks, playlists, genres..."
            aria-label="Search Vibra music streaming catalog"
            className="w-full rounded-full border border-white/8 bg-surface py-2.5 pl-11 pr-10 text-xs font-normal text-white placeholder-[#6B7A75] transition-all duration-150 focus:border-[#4CD964] focus:outline-none focus:ring-2 focus:ring-[#4CD964]/20 sm:text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search text"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#6B7A75] transition-colors hover:bg-white/8 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Section: User Avatar with Dropdown */}
      <div
        className="relative flex shrink-0 items-center gap-3"
        ref={dropdownRef}
      >
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-label="User account menu"
          className="flex items-center gap-2 rounded-full border border-white/8 bg-surface p-1.5 pr-2.5 transition-colors duration-150 hover:border-white/20 hover:bg-[#1B2421]"
        >
          {/* Avatar with Brand Gradient Ring */}
          <div className="brand-gradient flex h-7 w-7 items-center justify-center rounded-full p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0B0F0E] text-xs font-bold text-[#4CD964]">
              AR
            </div>
          </div>

          <span className="hidden text-xs font-semibold text-white sm:inline">
            Alex R.
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-[#A3B1AC] transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* User Dropdown Menu */}
        {isDropdownOpen && (
          <div className="animate-fadeIn absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/12 bg-surface py-2 shadow-[0_16px_40px_rgba(0,0,0,0.8)]">
            <div className="border-b border-white/6 px-4 py-2.5">
              <p className="text-xs font-bold text-white">Alex Rivera</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4CD964]" />
                <p className="text-[11px] font-medium text-[#4CD964]">
                  Free plan
                </p>
              </div>
            </div>

            <div className="py-1">
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs text-[#A3B1AC] transition-colors hover:bg-white/4 hover:text-white"
              >
                <Settings className="h-4 w-4 text-[#6B7A75]" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => setIsDropdownOpen(false)}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs text-error transition-colors hover:bg-error/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
