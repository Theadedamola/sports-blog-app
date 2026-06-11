import { MongoClient } from "mongodb";
import dns from "dns";

// Optimize DNS resolution inside Node.js to prevent querySrv EBADNAME errors on local networks
if (dns) {
  if (typeof dns.setDefaultResultOrder === "function") {
    dns.setDefaultResultOrder("ipv4first");
  }
  if (typeof dns.setServers === "function") {
    try {
      // Use public Cloudflare and Google DNS servers for the Node.js process resolving database SRV records
      dns.setServers(["1.1.1.1", "8.8.8.8"]);
    } catch (e) {
      console.warn("Failed to set custom DNS servers, using system defaults:", e);
    }
  }
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;
