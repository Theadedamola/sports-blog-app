import { fetchLiveMatches } from "@/lib/api/fetchers";
import { LivePageClient } from "./LivePageClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Matches",
  description: "Watch live football matches in real-time with scores, stats, and AI predictions.",
};

export default async function LivePage() {
  const liveMatches = await fetchLiveMatches();
  return <LivePageClient initialMatches={liveMatches} />;
}
