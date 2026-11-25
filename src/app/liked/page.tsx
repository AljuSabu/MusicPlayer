import LikedSongs from "@/components/LikedSongs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Liked Songs" };

export default function LikedPage() {
  return (
    <div className="py-4">
      <LikedSongs />
    </div>
  );
}
