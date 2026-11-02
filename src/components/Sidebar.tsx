"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Heart } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
  { href: "/liked", label: "Liked Songs", icon: Heart },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="row-span-2 flex flex-col gap-6 border-r border-line bg-surface/40 p-4">
      <Link href="/" className="px-2 pt-2">
        <Image
          src="/assets/logo.png"
          alt="Vibra"
          width={140}
          height={49}
          priority
          className="h-auto w-35"
        />
      </Link>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-elevated text-fg"
                  : "text-fg-2 hover:bg-elevated/60 hover:text-fg"
              }`}
            >
              <Icon size={20} className={active ? "text-brand" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line pt-4">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-fg-3">
          Your Playlists
        </p>
      </div>
    </aside>
  );
}
