import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import SidebarSkeleton from "@/components/SidebarSkeleton";
import TopBar from "@/components/TopBar";
import MobileHeader from "@/components/mobile/MobileHeader";
import PlayerBar from "@/components/PlayerBar";
import MiniPlayer from "@/components/mobile/MiniPlayer";
import BottomTabBar from "@/components/mobile/BottomTabBar";
import NowPlayingHost from "@/components/NowPlayingHost";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import { PlayerProvider } from "@/components/PlayerProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`);

const description =
  "Stream free music from independent artists. Discover tracks, albums and artists, save your favourites and feel every beat.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vibra – Feel every beat",
    template: "%s · Vibra",
  },
  description,
  applicationName: "Vibra",
  openGraph: {
    type: "website",
    siteName: "Vibra",
    title: "Vibra – Feel every beat",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibra – Feel every beat",
    description,
  },
  appleWebApp: {
    capable: true,
    title: "Vibra",
    statusBarStyle: "black-translucent",
  },
};

// viewport-fit=cover lets the safe-area padding work on notched phones
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#0B0F0E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="h-dvh overflow-hidden bg-bg font-sans text-fg">
        <PlayerProvider>
          {/* Keyboard users: the first Tab stop jumps past the navigation */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-[#4CD964] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#0B0F0E]"
          >
            Skip to main content
          </a>

          {/* Phones: one column. md and up: sidebar + content. The bottom row holds the player. */}
          <div className="grid h-full grid-cols-1 grid-rows-[minmax(0,1fr)_auto] md:grid-cols-[15rem_minmax(0,1fr)]">
            <Suspense fallback={<SidebarSkeleton />}>
              <Sidebar />
            </Suspense>

            <div className="flex min-h-0 min-w-0 flex-col">
              <Suspense fallback={<div className="h-14 shrink-0 md:hidden" />}>
                <MobileHeader />
              </Suspense>
              <Suspense
                fallback={
                  <div className="hidden h-16 shrink-0 border-b border-white/8 md:block" />
                }
              >
                <TopBar />
              </Suspense>

              <main
                id="main-content"
                tabIndex={-1}
                className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 outline-none md:px-8 md:pb-8"
              >
                {children}
              </main>
            </div>

            <div className="md:col-span-2">
              <div className="hidden md:block">
                <PlayerBar />
              </div>
              <div className="md:hidden">
                <MiniPlayer />
                <Suspense
                  fallback={<div className="h-16 border-t border-white/8" />}
                >
                  <BottomTabBar />
                </Suspense>
              </div>
            </div>
          </div>

          <NowPlayingHost />
          <KeyboardShortcuts />
        </PlayerProvider>
      </body>
    </html>
  );
}
