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
import { PlayerProvider } from "@/components/PlayerProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Vibra",
  description: "Feel every beat.",
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

              <main className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 md:px-8 md:pb-8">
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
        </PlayerProvider>
      </body>
    </html>
  );
}
