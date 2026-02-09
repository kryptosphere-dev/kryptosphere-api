import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectMongo } from "../lib/mongodb";
import { MongooseService } from "../services/mongoose";
import { IUserRole } from "../models";

/**
 * Initialization route to create root user
 * Should be called once after deployment
 * POST /api/setup
 * 
 * Requires SETUP_SECRET token in Authorization header or body
 * Security: Only works if root user doesn't exist yet
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  await connectMongo();

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  // Security check: require SETUP_SECRET token
  const setupSecret = process.env.SETUP_SECRET;
  if (!setupSecret) {
    console.error("SETUP_SECRET environment variable is not set");
    return res.status(500).json({ error: "Setup is not configured" });
  }

  // Get token from Authorization header or body
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith("Bearer ") 
    ? authHeader.substring(7) 
    : null;
  const tokenFromBody = req.body?.setupSecret;
  const providedToken = tokenFromHeader || tokenFromBody;

  if (!providedToken || providedToken !== setupSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const mongooseService = await MongooseService.getInstance();
    const userServices = mongooseService.userServices;
    const rootUser = await userServices.findUserByLogin("root");

    if (rootUser) {
      // Root user already exists - don't allow recreation
      return res.status(403).json({ 
        error: "Root user already exists. Setup can only be run once." 
      });
    }

    // Get credentials from body or use defaults
    const login = req.body?.login || "root";
    const password = req.body?.password || "root";
    const email = req.body?.email || "root@board.fr";
    const firstName = req.body?.firstName || "super";
    const lastName = req.body?.lastName || "admin";

    const newRootUser = await userServices.createUser({
      login,
      password,
      role: IUserRole.SuperAdmin,
      email,
      firstName,
      lastName
    });

    // Don't return sensitive user data
    return res.status(201).json({ 
      message: "Root user created successfully",
      login: newRootUser.login,
      email: newRootUser.email
    });
  } catch (error) {
    console.error("Setup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
