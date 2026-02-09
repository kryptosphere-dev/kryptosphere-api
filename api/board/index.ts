import { connectMongo } from "../../lib/mongodb";
import { MongooseService } from "../../services/mongoose";
import { verifySession, verifyRole, sendUnauthorized, sendForbidden, jsonResponse, errorResponse } from "../../lib/middleware";
import { IUserRole } from "../../models";

export async function POST(request: Request) {
  // MongoDB connection (automatically cached)
  await connectMongo();

  // Session verification
  const user = await verifySession(request);
  if (!user) {
    return sendUnauthorized();
  }

  // Role verification
  if (!verifyRole(user, IUserRole.SuperAdmin)) {
    return sendForbidden();
  }

  try {
    const body = await request.json();

    // Body validation
    if (!body || typeof body.name !== "string") {
      return errorResponse("Invalid request body", 400);
    }

    const mongooseService = await MongooseService.getInstance();
    const boardServices = mongooseService.boardServices;
    const board = await boardServices.createBoard(body);

    return jsonResponse(board);
  } catch (error) {
    console.error("Create board error:", error);
    return errorResponse("Internal server error", 500);
  }
}
