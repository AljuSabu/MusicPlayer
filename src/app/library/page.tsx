import LibraryView from "@/components/library/LibraryView";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Your Library" };

export default function LibraryPage() {
  return (
    <div className="py-4">
      <LibraryView />
    </div>
  );
}
