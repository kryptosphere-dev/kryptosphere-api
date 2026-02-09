import { connectMongo } from "../../lib/mongodb";
import { verifySession, sendUnauthorized, jsonResponse } from "../../lib/middleware";

export async function GET(request: Request) {
  // MongoDB connection (automatically cached)
  await connectMongo();

  // Session verification
  const user = await verifySession(request);
  if (!user) {
    return sendUnauthorized();
  }

  return jsonResponse(user);
}
