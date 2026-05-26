import { fetchMatches, fetchLiveMatches, fetchScheduledMatches } from "@/lib/api/fetchers";
import { HomeClient } from "./HomeClient";

export default async function HomePage() {
  const [allMatches, liveMatches, scheduledMatches] = await Promise.all([
    fetchMatches("football"),
    fetchLiveMatches(),
    fetchScheduledMatches(),
  ]);

  return (
    <HomeClient
      allMatches={allMatches}
      liveMatches={liveMatches}
      scheduledMatches={scheduledMatches}
    />
  );
}
