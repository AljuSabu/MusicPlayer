import { NextResponse } from "next/server";
import { getTracksByIds } from "@/lib/jamendo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Only accept numeric IDs, and cap the list so nobody can abuse the endpoint
  const ids = (searchParams.get("ids") ?? "")
    .split(",")
    .filter((id) => /^\d+$/.test(id))
    .slice(0, 100);

  try {
    const tracks = await getTracksByIds(ids);
    return NextResponse.json(tracks);
  } catch {
    return NextResponse.json(
      { error: "Failed to load tracks" },
      { status: 502 },
    );
  }
}
