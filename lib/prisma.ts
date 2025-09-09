import { PrismaClient } from "@/prisma/client";

import logger from "./logger";

const DATABASE_URI = process.env.DATABASE_URL as string;

if (!DATABASE_URI) {
  throw new Error("DATABASE_URI is not defined.");
}

interface PrismaCache {
  client: PrismaClient | null;
  promise: Promise<PrismaClient> | null;
}

declare global {
  var prisma: PrismaCache;
}

let cached = globalThis.prisma;

if (!cached) {
  cached = globalThis.prisma = { client: null, promise: null };
}

const dbConnect = async (): Promise<PrismaClient> => {
  if (cached.client) {
    logger.info("Using existing prisma connection.");
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = new Promise<PrismaClient>((resolve, reject) => {
      const prisma = new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "info", "warn", "error"]
            : ["warn", "error"],
      });

      prisma
        .$connect()
        .then(() => {
          logger.info("Connected to PostgreSQL");
          resolve(prisma);
        })
        .catch((error) => {
          logger.error("Error connecting to PostgreSQL", error);
          reject(error);
        });
    });
  }

  cached.client = await cached.promise;
  return cached.client;
};

export default dbConnect;
