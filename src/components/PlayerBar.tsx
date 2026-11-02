import { Play, SkipBack, SkipForward } from 'lucide-react';

export default function PlayerBar() {
  return (
    <footer className="flex items-center justify-center gap-6 border-t border-line bg-surface/80 backdrop-blur">
      <button className="text-fg-2 hover:text-fg" aria-label="Previous">
        <SkipBack size={22} />
      </button>
      <button
        className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient text-black"
        aria-label="Play"
      >
        <Play size={20} fill="currentColor" />
      </button>
      <button className="text-fg-2 hover:text-fg" aria-label="Next">
        <SkipForward size={22} />
      </button>
    </footer>
  );
}