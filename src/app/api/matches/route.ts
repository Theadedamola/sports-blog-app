import { NextResponse } from "next/server";
import { fetchMatches, fetchLiveMatches } from "@/lib/api/fetchers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "football";
    const live = searchParams.get("live");

    const matches = live === "true"
      ? await fetchLiveMatches()
      : await fetchMatches(category);

    return NextResponse.json({ success: true, data: matches });
  } catch (error) {
    console.error("Matches API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}
