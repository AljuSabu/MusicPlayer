"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  Globe,
  MoreHorizontal,
  Pause,
  Play,
} from "lucide-react";
import type { Track } from "@/types/music";
import { usePlayer } from "@/components/PlayerProvider";

export default function ArtistActions({
  tracks,
  jamendoUrl,
  website,
}: {
  tracks: Track[];
  jamendoUrl?: string;
  website?: string;
}) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const loaded = !!currentTrack && tracks.some((t) => t.id === currentTrack.id);
  const showPause = loaded && isPlaying;

  // Close on outside click / Escape (only listens while open)
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

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handlePlay = () => {
    if (loaded) togglePlay();
    else playTrack(tracks[0], tracks);
  };

  const handleCopy = async () => {
    setMenuOpen(false);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // clipboard blocked: nothing to do
    }
  };

  const menuItem =
    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs text-[#A3B1AC] transition-colors hover:bg-white/5 hover:text-white";

  return (
    <div className="flex items-center gap-4 pt-2">
      {tracks.length > 0 && (
        <button
          onClick={handlePlay}
          aria-label={showPause ? "Pause artist" : "Play artist music"}
          className="brand-gradient flex h-14 w-14 items-center justify-center rounded-full text-[#0B0F0E] shadow-[0_0_24px_rgba(76,217,100,0.4)] transition-transform hover:scale-105 active:scale-95"
        >
          {showPause ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="ml-1 h-6 w-6 fill-current" />
          )}
        </button>
      )}

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="More artist options"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-surface text-[#A3B1AC] transition-colors hover:border-white/20 hover:bg-elevated hover:text-white"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="animate-fadeIn absolute bottom-12 left-0 z-30 w-52 rounded-2xl border border-white/12 bg-surface p-1.5 shadow-2xl"
          >
            <button role="menuitem" onClick={handleCopy} className={menuItem}>
              <Copy className="h-4 w-4" />
              <span>Copy artist link</span>
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
                <ExternalLink className="h-4 w-4" />
                <span>Open on Jamendo</span>
              </a>
            )}
            {website && (
              <a
                role="menuitem"
                href={website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={() => setMenuOpen(false)}
                className={menuItem}
              >
                <Globe className="h-4 w-4" />
                <span>Artist website</span>
              </a>
            )}
          </div>
        )}
      </div>

      {copied && (
        <div className="animate-fadeIn flex items-center gap-1.5 rounded-full border border-[#4CD964]/40 bg-[#4CD964]/20 px-3 py-1 text-xs font-semibold text-[#4CD964]">
          <Check className="h-3.5 w-3.5" />
          <span>Link copied!</span>
        </div>
      )}
    </div>
  );
}
