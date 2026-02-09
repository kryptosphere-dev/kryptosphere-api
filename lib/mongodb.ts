import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI");
}

// Cache for MongoDB connection (required for serverless)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectMongo() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // If using separate environment variables for auth
    if (process.env.MONGODB_USER && process.env.MONGODB_PWD) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        ...opts,
        auth: {
          username: process.env.MONGODB_USER,
          password: process.env.MONGODB_PWD
        },
        authSource: 'admin',
        dbName: process.env.MONGODB_DB as string,
      });
    } else {
      // Otherwise, use MONGODB_URI directly which already contains credentials
      cached.promise = mongoose.connect(MONGODB_URI, opts);
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
