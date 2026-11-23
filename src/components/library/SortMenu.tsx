"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import { sortLabels, type LibrarySort } from "@/lib/library";

const options = Object.keys(sortLabels) as LibrarySort[];

export default function SortMenu({
  value,
  onChange,
}: {
  value: LibrarySort;
  onChange: (sort: LibrarySort) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex min-h-11 items-center gap-2 rounded-full border border-white/8 bg-surface px-4 text-xs font-semibold text-white transition-colors hover:bg-elevated active:scale-95 sm:min-h-0 sm:px-3 sm:py-1.5"
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-[#4CD964]" />
        <span className="text-[#A3B1AC]">Sort:</span>
        <span>{sortLabels[value]}</span>
        <ChevronDown className="h-3.5 w-3.5 text-[#6B7A75]" />
      </button>

      {open && (
        // Phones: the button sits at the left edge, so open to the right of it.
        // sm and up: the button is on the right, so open to the left.
        <div
          role="menu"
          className="animate-fadeIn absolute left-0 top-full z-40 mt-1 w-52 rounded-2xl border border-white/12 bg-surface p-1.5 shadow-2xl sm:left-auto sm:right-0 sm:w-48"
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <button
                key={option}
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-xs transition-colors sm:py-2 ${
                  selected
                    ? "bg-white/6 font-bold text-[#4CD964]"
                    : "text-[#A3B1AC] hover:bg-white/4 hover:text-white"
                }`}
              >
                <span>{sortLabels[option]}</span>
                {selected && <Check className="h-3.5 w-3.5 text-[#4CD964]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
