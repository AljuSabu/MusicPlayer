import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="flex items-center gap-4 px-8 py-4">
      <div className="flex gap-2">
        <button className="rounded-full bg-surface p-2 text-fg-2 hover:text-fg" aria-label="Back">
          <ChevronLeft size={18} />
        </button>
        <button className="rounded-full bg-surface p-2 text-fg-2 hover:text-fg" aria-label="Forward">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex max-w-xl flex-1 items-center gap-3 rounded-full border border-line bg-surface px-4 py-2.5 focus-within:border-brand">
        <Search size={18} className="text-fg-3" />
        <input
          placeholder="Search artists, tracks, playlists, genres..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-fg-3"
        />
      </div>
    </header>
  );
}