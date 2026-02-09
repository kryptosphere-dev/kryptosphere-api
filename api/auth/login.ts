import { connectMongo } from "../../lib/mongodb";
import { MongooseService } from "../../services/mongoose";
import { jsonResponse, errorResponse } from "../../lib/middleware";

export async function POST(request: Request) {
  // MongoDB connection (automatically cached)
  await connectMongo();

  try {
    const body = await request.json();

    // Body validation
    if (!body || typeof body.login !== "string" || typeof body.password !== "string") {
      return errorResponse("Invalid request body", 400);
    }

    const mongooseService = await MongooseService.getInstance();
    const userServices = mongooseService.userServices;
    const validUser = await userServices.findValidUser(body.login, body.password);

    if (!validUser) {
      return errorResponse("Invalid credentials", 401);
    }

    const sessionServices = mongooseService.sessionServices;
    const session = await sessionServices.createSession({ user: validUser });

    return jsonResponse({ session: session._id });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Internal server error", 500);
  }
}
