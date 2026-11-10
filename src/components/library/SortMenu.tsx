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
        className="flex items-center gap-2 rounded-full border border-white/8 bg-surface px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-elevated"
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-[#4CD964]" />
        <span className="text-[#A3B1AC]">Sort:</span>
        <span>{sortLabels[value]}</span>
        <ChevronDown className="h-3.5 w-3.5 text-[#6B7A75]" />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-fadeIn absolute right-0 top-10 z-40 w-48 rounded-2xl border border-white/12 bg-surface p-1.5 shadow-2xl"
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
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
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
