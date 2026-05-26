import { BLOG_POSTS } from "@/lib/api/blog-data";
import { BlogDetailClient } from "./BlogDetailClient"
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = BLOG_POSTS.find((p) => p.id === id);
  if (!post) return { title: "Article Not Found" };

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const post = BLOG_POSTS.find((p) => p.id === id);

  return <BlogDetailClient initialPost={post || null} postId={id} />;
}
