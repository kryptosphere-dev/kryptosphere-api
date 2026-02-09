import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectMongo } from "../../lib/mongodb";
import { MongooseService } from "../../services/mongoose";
import { verifySession, verifyRole, sendUnauthorized, sendForbidden, AuthenticatedRequest } from "../../lib/middleware";
import { IUserRole } from "../../models";

export default async function handler(
  req: AuthenticatedRequest,
  res: VercelResponse
) {
  // MongoDB connection (automatically cached)
  await connectMongo();

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  // Session verification
  const user = await verifySession(req);
  if (!user) {
    return sendUnauthorized(res);
  }

  // Role verification
  if (!verifyRole(user, IUserRole.SuperAdmin)) {
    return sendForbidden(res);
  }

  // Body validation
  if (!req.body || typeof req.body.name !== "string") {
    return res.status(400).end();
  }

  try {
    const mongooseService = await MongooseService.getInstance();
    const boardServices = mongooseService.boardServices;
    const board = await boardServices.createBoard(req.body);

    return res.status(200).json(board);
  } catch (error) {
    console.error("Create board error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
