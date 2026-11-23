"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  ListPlus,
  MoreHorizontal,
  Pause,
  Play,
  Shuffle,
} from "lucide-react";
import type { Track } from "@/types/music";
import { usePlayer } from "@/components/PlayerProvider";

export default function AlbumActions({
  tracks,
  jamendoUrl,
}: {
  tracks: Track[];
  jamendoUrl?: string;
}) {
  const {
    currentTrack,
    isPlaying,
    isShuffle,
    playTrack,
    togglePlay,
    toggleShuffle,
    addToQueue,
  } = usePlayer();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const albumLoaded =
    !!currentTrack && tracks.some((t) => t.id === currentTrack.id);
  const showPause = albumLoaded && isPlaying;

  // Close the menu on outside click or Escape (only listens while open)
  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Hide the little confirmation badge after 2 seconds
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2000);
    return () => clearTimeout(timer);
  }, [notice]);

  const handlePlay = () => {
    if (albumLoaded) togglePlay();
    else playTrack(tracks[0], tracks);
  };

  const handleShuffle = () => {
    const turningOn = !isShuffle;
    toggleShuffle();
    // Start from a random track if this album isn't playing yet
    if (turningOn && !albumLoaded) {
      playTrack(tracks[Math.floor(Math.random() * tracks.length)], tracks);
    }
  };

  const handleAddToQueue = () => {
    setMenuOpen(false);
    if (!currentTrack) playTrack(tracks[0], tracks);
    else addToQueue(tracks);
    setNotice("Added to queue");
  };

  const handleCopyLink = async () => {
    setMenuOpen(false);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("Link copied!");
    } catch {
      // clipboard blocked: nothing to do
    }
  };

  const menuItem =
    "flex w-full items-center gap-2.5 rounded-lg px-3 py-3 text-left text-xs font-semibold text-[#A3B1AC] transition-colors hover:bg-white/6 hover:text-white md:py-2";

  return (
    <section className="relative flex flex-col items-center gap-2 border-white/8 py-1 md:flex-row md:justify-between md:border-y md:py-2">
      <div className="flex items-center gap-5 sm:gap-5">
        {/* On phones: Shuffle, Play, Menu (as in the design). On desktop: Play first. */}
        <button
          onClick={handlePlay}
          aria-label={showPause ? "Pause album" : "Play album"}
          className="brand-gradient order-2 flex h-14 w-14 items-center justify-center rounded-full text-[#0B0F0E] shadow-[0_0_24px_rgba(76,217,100,0.45)] transition-transform hover:scale-105 active:scale-95 md:order-1"
        >
          {showPause ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="h-6 w-6 translate-x-0.5 fill-current" />
          )}
        </button>

        <button
          onClick={handleShuffle}
          aria-label="Toggle shuffle"
          aria-pressed={isShuffle}
          className={`order-1 flex h-11 w-11 items-center justify-center rounded-full border transition-colors md:order-2 md:h-10 md:w-10 ${
            isShuffle
              ? "border-[#4CD964]/40 bg-[#4CD964]/20 text-[#4CD964]"
              : "border-white/8 bg-surface text-[#A3B1AC] hover:bg-elevated hover:text-white"
          }`}
        >
          <Shuffle className="h-4 w-4" />
        </button>

        <div className="relative order-3" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="More album options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-surface text-[#A3B1AC] transition-colors hover:bg-elevated hover:text-white md:h-10 md:w-10"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="animate-fadeIn absolute right-0 top-12 z-30 w-52 space-y-1 rounded-2xl border border-white/12 bg-surface p-2 shadow-2xl md:left-0 md:right-auto"
            >
              <button
                role="menuitem"
                onClick={handleAddToQueue}
                className={menuItem}
              >
                <ListPlus className="h-4 w-4 text-[#4CD964]" />
                <span>Add to queue</span>
              </button>
              <button
                role="menuitem"
                onClick={handleCopyLink}
                className={menuItem}
              >
                <Copy className="h-4 w-4 text-[#A6E23A]" />
                <span>Copy link</span>
              </button>
              {jamendoUrl && (
                <a
                  role="menuitem"
                  href={jamendoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className={menuItem}
                >
                  <ExternalLink className="h-4 w-4 text-[#1BC5A0]" />
                  <span>Open on Jamendo</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Below the row on phones (so the centered buttons never shift), beside it on desktop */}
      {notice && (
        <div className="pointer-events-none absolute inset-x-0 top-full z-10 mt-2 flex justify-center md:pointer-events-auto md:static md:mt-0">
          <div className="animate-fadeIn flex items-center gap-1.5 rounded-full border border-[#4CD964]/40 bg-[#4CD964]/20 px-3 py-1 text-xs font-semibold text-[#4CD964]">
            <Check className="h-3.5 w-3.5" />
            <span>{notice}</span>
          </div>
        </div>
      )}
    </section>
  );
}
