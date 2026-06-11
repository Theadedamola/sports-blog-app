import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import {
  fetchMatches,
  fetchLiveMatches,
} from "@/lib/api/fetchers";

export async function GET() {
  // Fetch match data from the same source that feeds /live and the homepage
  let allMatches = 0;
  let liveMatches = 0;
  let activeStreams = 0;

  try {
    const [all, live] = await Promise.all([
      fetchMatches("football"),
      fetchLiveMatches(),
    ]);

    allMatches = all.length;
    liveMatches = live.length;
    activeStreams = all.filter((m) => m.streamUrl).length;
  } catch (e) {
    console.error("Stats: failed to fetch matches", e);
  }

  // Fetch article count from MongoDB
  let totalArticles = 0;
  let dbMode: "mongodb" | "fallback" = "fallback";

  try {
    const hasMongo = !!process.env.MONGODB_URI;

    if (hasMongo && clientPromise) {
      const client = await clientPromise;
      if (client) {
        const db = client.db(process.env.MONGODB_DB || "sportsapp");
        totalArticles = await db.collection("posts").countDocuments();
        dbMode = "mongodb";
      }
    }
  } catch (error: any) {
    console.error("Stats: DB error", error.message);
  }

  return NextResponse.json({
    liveMatches,
    activeStreams,
    totalMatches: allMatches,
    totalArticles,
    dbMode,
  });
}
