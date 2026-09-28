import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;

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
  // ── Google OAuth Social Provider ──────────────────────────────────────
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
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
