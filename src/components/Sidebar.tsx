"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Heart, Plus, Music } from "lucide-react";
import { mockPlaylists } from "@/lib/mock-data";

const mainNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
  { href: "/liked", label: "Liked Songs", icon: Heart },
];

export default function Sidebar() {
  const pathname = usePathname();
  const playlists = mockPlaylists;

  const handleCreatePlaylist = () => {
    // TODO: open a "create playlist" modal (later step)
  };

  return (
    <aside
      aria-label="Main Navigation Sidebar"
      className="row-span-2 z-30 flex h-full w-60 shrink-0 select-none flex-col justify-between border-r border-white/8 bg-[#0B0F0E]"
    >
      {/* Top Branding Section */}
      <div className="p-6 pb-2">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt="Vibra"
            width={140}
            height={49}
            priority
            className="h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(76,217,100,0.3)]"
          />
        </Link>
      </div>

      {/* Main Navigation Items */}
      <nav className="space-y-1 px-3 py-4">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex w-full items-center gap-3.5 rounded-lg px-4 py-2.5 text-left text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-[#1B2421] text-white shadow-[0_2px_12px_rgba(0,0,0,0.3)]'
                  : 'text-[#A3B1AC] hover:bg-white/3 hover:text-white'
              }`}
            >
              {/* Green gradient indicator bar for active item */}
              {isActive && (
                <div
                  aria-hidden="true"
                  className="brand-gradient absolute bottom-1.5 left-0 top-1.5 w-1 rounded-r-full shadow-[0_0_8px_#4CD964]"
                />
              )}

              <Icon
                className={`h-4 w-4 transition-colors ${
                  isActive ? 'text-[#4CD964]' : 'text-[#A3B1AC] group-hover:text-white'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Subtle Divider */}
      <div className="mx-4 border-t border-white/8" />

      {/* Scrollable User Playlists Section */}
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#6B7A75]">
          <span>Your Playlists</span>
          <span className="font-mono text-[10px] text-[#A3B1AC]">{playlists.length}</span>
        </div>

        <div className="space-y-1">
          {playlists.map((pl) => {
            const isSelected = pathname === `/playlist/${pl.id}`;
            return (
              <Link
                key={pl.id}
                href={`/playlist/${pl.id}`}
                className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors duration-150 ${
                  isSelected
                    ? 'bg-[#1B2421] text-white'
                    : 'text-[#A3B1AC] hover:bg-white/3 hover:text-white'
                }`}
              >
                {/* Small Cover Thumbnail */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/8 bg-linear-to-br shadow-sm ${pl.coverGradient}`}
                >
                  <Music className="h-3.5 w-3.5 text-white/80" />
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    className={`truncate text-xs font-medium ${
                      isSelected ? 'text-[#4CD964]' : 'group-hover:text-white'
                    }`}
                  >
                    {pl.name}
                  </div>
                  <div className="truncate text-[10px] text-[#6B7A75]">
                    {pl.creator || 'Playlist'} · {pl.trackCount} tracks
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: "+ Create playlist" Button */}
      <div className="border-t border-white/8 bg-[#0B0F0E] p-3">
        <button
          onClick={handleCreatePlaylist}
          className="group flex w-full items-center justify-center gap-2 rounded-lg border border-white/8 bg-surface px-4 py-2.5 text-xs font-semibold text-white transition-all duration-150 hover:border-white/20 hover:bg-[#1B2421] active:scale-[0.98]"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-white/8 text-white transition-all group-hover:brand-gradient group-hover:text-[#0B0F0E]">
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          </div>
          <span>Create playlist</span>
        </button>
      </div>
    </aside>
  );
}