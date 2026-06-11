import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { fetchBlogPostById } from "@/lib/api/blog-fetcher";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const post = await fetchBlogPostById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const hasMongo = !!process.env.MONGODB_URI;
    if (!hasMongo || !clientPromise) {
      return NextResponse.json(
        { error: "MongoDB not connected", mode: "fallback" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    if (!client) {
      return NextResponse.json(
        { error: "MongoDB client failed to load", mode: "fallback" },
        { status: 400 }
      );
    }

    const db = client.db(process.env.MONGODB_DB || "sportsapp");
    const postsCol = db.collection("posts");

    // Delete post by matching custom id string or MongoDB ObjectId if matches format
    const deleteResult = await postsCol.deleteOne({ id: id });

    if (deleteResult.deletedCount === 0) {
      // Also try matching by title/slug/id in different formats
      const deleteResult2 = await postsCol.deleteOne({ slug: id });
      if (deleteResult2.deletedCount === 0) {
        return NextResponse.json(
          { error: "Post not found or already deleted" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ success: true, mode: "mongodb" });
  } catch (error: any) {
    console.error("Blog DELETE API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete post" },
      { status: 500 }
    );
  }
}
