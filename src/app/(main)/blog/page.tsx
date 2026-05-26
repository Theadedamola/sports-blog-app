import { BLOG_POSTS } from "@/lib/api/blog-data";
import { BlogClient } from "./BlogClient";
import { fetchLiveMatches, fetchScheduledMatches } from "@/lib/api/fetchers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sports Blog",
  description: "Latest football tactical reviews, scouts analysis, and performance breakdowns.",
};

export default async function BlogPage() {
  const [liveMatches, scheduledMatches] = await Promise.all([
    fetchLiveMatches(),
    fetchScheduledMatches()
  ]);

  return (
    <BlogClient
      posts={BLOG_POSTS}
      liveMatches={liveMatches}
      scheduledMatches={scheduledMatches}
    />
  );
}
