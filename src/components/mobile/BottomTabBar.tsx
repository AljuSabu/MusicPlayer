"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, Search } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/search",
    label: "Search",
    icon: Search,
    match: (p: string) => p.startsWith("/search") || p.startsWith("/genre"),
  },
  {
    href: "/library",
    label: "Library",
    icon: Library,
    match: (p: string) => p.startsWith("/library") || p.startsWith("/liked"),
  },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="border-t border-white/8 bg-[#0B0F0E] pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex h-16 items-stretch justify-around px-4">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="relative flex h-full flex-col items-center justify-center gap-0.5 transition-transform active:scale-95"
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="brand-gradient absolute top-1 h-1.5 w-1.5 rounded-full shadow-[0_0_8px_#4CD964]"
                  />
                )}
                <Icon
                  className={`h-5 w-5 ${active ? "text-[#4CD964]" : "text-[#A3B1AC]"}`}
                />
                <span
                  className={`text-[11px] font-semibold ${
                    active ? "text-white" : "text-[#6B7A75]"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
