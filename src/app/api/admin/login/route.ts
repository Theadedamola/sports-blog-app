import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hashPassword, verifyPassword } from "@/lib/utils/password";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if MongoDB is configured
    const hasMongo = !!process.env.MONGODB_URI;

    if (!hasMongo || !clientPromise) {
      // Fallback mode: verify against default admin credentials
      if (username.trim() === "admin" && password.trim() === "admin") {
        return NextResponse.json({ success: true, mode: "fallback" });
      }
      return NextResponse.json(
        { error: "Invalid credentials (Fallback Mode)" },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    if (!client) {
      if (username.trim() === "admin" && password.trim() === "admin") {
        return NextResponse.json({ success: true, mode: "fallback" });
      }
      return NextResponse.json(
        { error: "Invalid credentials (Fallback Mode)" },
        { status: 401 }
      );
    }

    const db = client.db(process.env.MONGODB_DB || "sportsapp");
    const adminsCol = db.collection("admins");

    // Seed default admin if collection is empty
    const adminCount = await adminsCol.countDocuments();
    if (adminCount === 0) {
      const defaultAdmin = {
        username: "admin",
        passwordHash: hashPassword("admin"),
        createdAt: new Date(),
      };
      await adminsCol.insertOne(defaultAdmin);
    }

    // Find the admin user
    const adminUser = await adminsCol.findOne({ username });

    if (!adminUser || !adminUser.passwordHash) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isMatched = verifyPassword(password, adminUser.passwordHash);
    if (!isMatched) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, mode: "mongodb" });
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
