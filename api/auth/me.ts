import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectMongo } from "../../lib/mongodb";
import { verifySession, sendUnauthorized, AuthenticatedRequest } from "../../lib/middleware";

export default async function handler(
  req: AuthenticatedRequest,
  res: VercelResponse
) {
  // MongoDB connection (automatically cached)
  await connectMongo();

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  // Session verification
  const user = await verifySession(req);
  if (!user) {
    return sendUnauthorized(res);
  }

  return res.status(200).json(user);
}
