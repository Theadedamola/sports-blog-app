import { fetchBlogPostById } from "@/lib/api/blog-fetcher";
import { BlogDetailClient } from "./BlogDetailClient"
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchBlogPostById(id);
  if (!post) return { title: "Article Not Found" };

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await fetchBlogPostById(id);

  return <BlogDetailClient initialPost={post} postId={id} />;
}

