import { connectMongo } from "../lib/mongodb";
import { jsonResponse, errorResponse } from "../lib/middleware";

/**
 * Healthcheck route
 * GET /api/health
 *
 * - Returns 200 if the function is reachable and MongoDB is accessible
 * - Returns 500 if the database connection fails
 */
export async function GET(request: Request): Promise<Response> {
  const start = Date.now();

  try {
    await connectMongo();

    return jsonResponse({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      db: "up",
      responseTimeMs: Date.now() - start,
    });
  } catch (error) {
    console.error("Healthcheck error:", error);
    return errorResponse("Database connection failed", 500);
  }
}

