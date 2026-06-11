import clientPromise from "@/lib/mongodb";
import { BLOG_POSTS } from "./blog-data";
import type { BlogPost } from "./blog-data";

/**
 * Fetch all blog posts server-side
 */
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const hasMongo = !!process.env.MONGODB_URI;
    if (!hasMongo || !clientPromise) {
      return BLOG_POSTS;
    }

    const client = await clientPromise;
    if (!client) {
      return BLOG_POSTS;
    }

    const db = client.db(process.env.MONGODB_DB || "sportsapp");
    const postsCol = db.collection("posts");

    const postsCount = await postsCol.countDocuments();
    if (postsCount === 0) {
      // Seed initial posts
      await postsCol.insertMany(BLOG_POSTS);
      return BLOG_POSTS;
    }

    const posts = await postsCol.find({}).sort({ createdAt: -1, _id: -1 }).toArray();
    
    return posts.map((p) => {
      const { _id, ...rest } = p;
      return {
        id: rest.id || _id.toString(),
        title: rest.title,
        slug: rest.slug,
        category: rest.category,
        readTime: rest.readTime,
        publishedDate: rest.publishedDate,
        summary: rest.summary,
        coverImage: rest.coverImage,
        author: rest.author,
        content: rest.content,
      };
    }) as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts server-side:", error);
    return BLOG_POSTS;
  }
}

/**
 * Fetch a single blog post by its ID server-side
 */
export async function fetchBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const hasMongo = !!process.env.MONGODB_URI;
    
    // Check static list first
    const staticPost = BLOG_POSTS.find((p) => p.id === id || p.slug === id);
    
    if (!hasMongo || !clientPromise) {
      return staticPost || null;
    }

    const client = await clientPromise;
    if (!client) {
      return staticPost || null;
    }

    const db = client.db(process.env.MONGODB_DB || "sportsapp");
    const postsCol = db.collection("posts");

    // Try finding by custom id or slug
    const post = await postsCol.findOne({
      $or: [{ id: id }, { slug: id }],
    });

    if (!post) {
      return staticPost || null;
    }

    const { _id, ...rest } = post;
    return {
      id: rest.id || _id.toString(),
      title: rest.title,
      slug: rest.slug,
      category: rest.category,
      readTime: rest.readTime,
      publishedDate: rest.publishedDate,
      summary: rest.summary,
      coverImage: rest.coverImage,
      author: rest.author,
      content: rest.content,
    } as BlogPost;
  } catch (error) {
    console.error(`Error fetching blog post ${id} server-side:`, error);
    return null;
  }
}
