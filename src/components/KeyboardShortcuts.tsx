"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "@/components/PlayerProvider";

// Never take over keys while someone is typing or using a native control
const IGNORE =
  'input, textarea, select, [contenteditable="true"], [role="slider"], [role="menu"], [role="menuitem"], [role="menuitemradio"]';
// A focused button or link already reacts to Space on its own
const NATIVE_SPACE = 'button, a, summary, [role="button"]';

export default function KeyboardShortcuts() {
  const player = usePlayer();
  const latest = useRef(player);

  // Keep the newest player state available without re-subscribing the listener
  useEffect(() => {
    latest.current = player;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;

      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest(IGNORE)) return;

      // Holding a key repeats it: only the arrow keys should repeat
      if (e.repeat && !e.key.startsWith("Arrow")) return;

      // "/" jumps to the search box, even when nothing is playing
      if (e.key === "/") {
        const visibleBox = Array.from(
          document.querySelectorAll<HTMLInputElement>(
            'input[aria-label^="Search Vibra"]',
          ),
        ).find((el) => el.offsetParent !== null);
        if (visibleBox) {
          e.preventDefault();
          visibleBox.focus();
          visibleBox.select();
        }
        return;
      }

      const p = latest.current;
      if (!p.currentTrack) return;

      switch (e.key) {
        case " ":
          if (target?.closest(NATIVE_SPACE)) return;
          e.preventDefault();
          p.togglePlay();
          break;

        case "ArrowRight":
        case "ArrowLeft": {
          const audio = p.audioRef.current;
          if (!audio) return;
          e.preventDefault();
          const end =
            p.duration > 0
              ? p.duration
              : Number.isFinite(audio.duration)
                ? audio.duration
                : Infinity;
          const to = audio.currentTime + (e.key === "ArrowRight" ? 5 : -5);
          p.seek(Math.min(Math.max(to, 0), end));
          break;
        }

        case "ArrowUp":
        case "ArrowDown":
          // Plain arrows keep scrolling the page; Shift + arrow changes volume
          if (!e.shiftKey) return;
          e.preventDefault();
          p.setVolume(
            Math.min(
              100,
              Math.max(0, p.volume + (e.key === "ArrowUp" ? 5 : -5)),
            ),
          );
          break;

        case "m":
        case "M":
          p.toggleMute();
          break;
        case "n":
        case "N":
          p.next();
          break;
        case "p":
        case "P":
          p.prev();
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
