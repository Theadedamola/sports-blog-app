import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { BLOG_POSTS } from "@/lib/api/blog-data";

export async function GET() {
  try {
    const hasMongo = !!process.env.MONGODB_URI;

    if (!hasMongo || !clientPromise) {
      // Return static posts if MongoDB is not configured
      return NextResponse.json({ posts: BLOG_POSTS, mode: "fallback" });
    }

    const client = await clientPromise;
    if (!client) {
      return NextResponse.json({ posts: BLOG_POSTS, mode: "fallback" });
    }

    const db = client.db(process.env.MONGODB_DB || "sportsapp");
    const postsCol = db.collection("posts");

    // Seed default posts if collection is empty
    const postsCount = await postsCol.countDocuments();
    if (postsCount === 0) {
      await postsCol.insertMany(BLOG_POSTS);
    }

    // Retrieve and sort posts (latest first)
    const posts = await postsCol.find({}).sort({ createdAt: -1, _id: -1 }).toArray();

    // Map _id to id if needed, though they already have standard string id
    const formattedPosts = posts.map(p => {
      const { _id, ...rest } = p;
      return { id: rest.id || _id.toString(), ...rest };
    });

    return NextResponse.json({ posts: formattedPosts, mode: "mongodb" });
  } catch (error: any) {
    console.error("Blog GET API Error:", error);
    // Return mock posts as a graceful fallback on connection failure
    return NextResponse.json(
      { posts: BLOG_POSTS, error: error.message, mode: "fallback" },
      { status: 200 } // Keep it successful so the UI still displays content
    );
  }
}

export async function POST(request: Request) {
  try {
    const postData = await request.json();

    const hasMongo = !!process.env.MONGODB_URI;
    if (!hasMongo || !clientPromise) {
      return NextResponse.json(
        { error: "MongoDB not connected. Saving locally.", mode: "fallback" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    if (!client) {
      return NextResponse.json(
        { error: "MongoDB client failed to load. Saving locally.", mode: "fallback" },
        { status: 400 }
      );
    }

    const db = client.db(process.env.MONGODB_DB || "sportsapp");
    const postsCol = db.collection("posts");

    const newPost = {
      ...postData,
      createdAt: new Date(),
    };

    const result = await postsCol.insertOne(newPost);

    return NextResponse.json({
      success: true,
      postId: postData.id || result.insertedId.toString(),
      mode: "mongodb"
    });
  } catch (error: any) {
    console.error("Blog POST API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create post" },
      { status: 500 }
    );
  }
}
