import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import PlayerBar from "@/components/PlayerBar";
import { PlayerProvider } from "@/components/PlayerProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Vibra",
  description: "Feel every beat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="grid h-screen grid-cols-[240px_1fr] grid-rows-[minmax(0,1fr)_88px] overflow-hidden bg-bg font-sans text-fg">
        <PlayerProvider>
          <Sidebar />
          <div className="flex min-h-0 flex-col">
            <Suspense
              fallback={
                <div className="h-16 shrink-0 border-b border-white/8" />
              }
            >
              <TopBar />
            </Suspense>
            <main className="flex-1 overflow-y-auto px-8 pb-8">{children}</main>
          </div>
          <PlayerBar />
        </PlayerProvider>
      </body>
    </html>
  );
}
