import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/frameflow";

// Cache client for serverless environments
let mongoClient: MongoClient;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(MONGODB_URI);
  }
  mongoClient = globalWithMongo._mongoClient;
} else {
  mongoClient = new MongoClient(MONGODB_URI);
}

const db = mongoClient.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET || "frameflow-secret-fallback-key-32chars",
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "creator",
      },
    },
  },
});
