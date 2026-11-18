"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const ROOT_PATHS = ["/", "/search", "/library"];

export default function MobileHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isRoot = ROOT_PATHS.includes(pathname);

  const goBack = () => {
    // If the app was opened directly on this page, there is nothing to go back to
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <header className="shrink-0 border-b border-white/6 bg-[#0B0F0E] pt-[env(safe-area-inset-top)] md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-1">
          {!isRoot && (
            <button
              onClick={goBack}
              aria-label="Go back"
              className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full text-[#A3B1AC] active:bg-white/6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <Link href="/" aria-label="Vibra home">
            <Image
              src="/assets/logo.png"
              alt="Vibra"
              width={112}
              height={40}
              className="h-7 w-auto"
            />
          </Link>
        </div>

        <div
          aria-hidden="true"
          className="brand-gradient flex h-8 w-8 items-center justify-center rounded-full p-0.5"
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0B0F0E] text-[10px] font-bold text-[#4CD964]">
            AR
          </div>
        </div>
      </div>
    </header>
  );
}
