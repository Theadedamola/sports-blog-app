import { fetchMatches, fetchLiveMatches, fetchScheduledMatches } from "@/lib/api/fetchers";
import { fetchBlogPosts } from "@/lib/api/blog-fetcher";
import { HomeClient } from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allMatches, liveMatches, scheduledMatches, blogPosts] = await Promise.all([
    fetchMatches("football"),
    fetchLiveMatches(),
    fetchScheduledMatches(),
    fetchBlogPosts(),
  ]);

  return (
    <HomeClient
      allMatches={allMatches}
      liveMatches={liveMatches}
      scheduledMatches={scheduledMatches}
      posts={blogPosts}
    />
  );
}

