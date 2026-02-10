import { connectMongo } from "../lib/mongodb";
import { MongooseService } from "../services/mongoose/mongoose.service";
import { IUserRole } from "../models";
import { jsonResponse, errorResponse } from "../lib/middleware";

/**
 * Initialization route to create root user
 * Should be called once after deployment
 * POST /api/setup
 * 
 * Requires SETUP_SECRET token in Authorization header or body
 * Security: Only works if root user doesn't exist yet
 */
export async function POST(request: Request) {
  await connectMongo();

  // Security check: require SETUP_SECRET token
  const setupSecret = process.env.SETUP_SECRET;
  if (!setupSecret) {
    console.error("SETUP_SECRET environment variable is not set");
    return errorResponse("Setup is not configured", 500);
  }

  try {
    const body = await request.json();

    // Get token from Authorization header or body
    const authHeader = request.headers.get("authorization");
    const tokenFromHeader = authHeader?.startsWith("Bearer ") 
      ? authHeader.substring(7) 
      : null;
    const tokenFromBody = body?.setupSecret;
    const providedToken = tokenFromHeader || tokenFromBody;

    if (!providedToken || providedToken !== setupSecret) {
      return errorResponse("Unauthorized", 401);
    }

    const mongooseService = await MongooseService.getInstance();
    const userServices = mongooseService.userServices;
    const rootUser = await userServices.findUserByLogin("root");

    if (rootUser) {
      // Root user already exists - don't allow recreation
      return errorResponse("Root user already exists. Setup can only be run once.", 403);
    }

    // Get credentials from body or use defaults
    const login = body?.login || "root";
    const password = body?.password || "root";
    const email = body?.email || "root@board.fr";
    const firstName = body?.firstName || "super";
    const lastName = body?.lastName || "admin";

    const newRootUser = await userServices.createUser({
      login,
      password,
      role: IUserRole.SuperAdmin,
      email,
      firstName,
      lastName
    });

    // Don't return sensitive user data
    return jsonResponse({
      message: "Root user created successfully",
      login: newRootUser.login,
      email: newRootUser.email
    }, 201);
  } catch (error) {
    console.error("Setup error:", error);
    return errorResponse("Internal server error", 500);
  }
}
