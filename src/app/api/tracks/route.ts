import { NextResponse } from "next/server";
import { getTracksByIds } from "@/lib/jamendo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Only numeric ids, capped so the endpoint can't be abused
  const ids = (searchParams.get("ids") ?? "")
    .split(",")
    .filter((id) => /^\d+$/.test(id))
    .slice(0, 100);

  try {
    const tracks = await getTracksByIds(ids);
    return NextResponse.json(tracks, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[api/tracks] Jamendo lookup failed:", err);
    return NextResponse.json(
      { error: "Failed to load tracks" },
      { status: 502 },
    );
  }
}
