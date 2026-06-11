import { fetchBlogPosts } from "@/lib/api/blog-fetcher";
import { BlogClient } from "./BlogClient";
import { fetchLiveMatches, fetchScheduledMatches } from "@/lib/api/fetchers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sports Blog",
  description: "Latest football tactical reviews, scouts analysis, and performance breakdowns.",
};

export default async function BlogPage() {
  const [liveMatches, scheduledMatches, posts] = await Promise.all([
    fetchLiveMatches(),
    fetchScheduledMatches(),
    fetchBlogPosts(),
  ]);

  return (
    <BlogClient
      posts={posts}
      liveMatches={liveMatches}
      scheduledMatches={scheduledMatches}
    />
  );
}

