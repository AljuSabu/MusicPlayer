import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import PlayerBar from '@/components/PlayerBar';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'Vibra',
  description: 'Feel every beat.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="grid h-screen grid-cols-[240px_1fr] grid-rows-[1fr_88px] overflow-hidden bg-bg font-sans text-fg">
        <Sidebar />
        <div className="flex min-h-0 flex-col">
          <TopBar />
          <main className="flex-1 overflow-y-auto px-8 pb-8">{children}</main>
        </div>
        <PlayerBar />
      </body>
    </html>
  );
}