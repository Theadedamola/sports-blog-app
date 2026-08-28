import { MongoClient, MongoClientOptions } from "mongodb";
import dns from "dns";

// Optimize DNS resolution inside Node.js to prefer IPv4 if supported
if (dns && typeof dns.setDefaultResultOrder === "function") {
  try {
    dns.setDefaultResultOrder("ipv4first");
  } catch {
    // Ignore if not supported in the current environment
  }
}

const uri = process.env.MONGODB_URI;

const options: MongoClientOptions = {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000,
  maxPoolSize: 10,
};

let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  // In serverless environments (like AWS Lambda, Netlify, Vercel), caching the client
  // in a global variable preserves the active connection pool across warm invocations
  // and prevents unhandled timeout rejections when containers freeze and thaw.
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
      // If the initial connection fails, clear the cached promise so subsequent requests can retry
      globalWithMongo._mongoClientPromise = undefined;
      throw err;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
}

export default clientPromise;

