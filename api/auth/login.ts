import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectMongo } from "../../lib/mongodb";
import { MongooseService } from "../../services/mongoose";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // MongoDB connection (automatically cached)
  await connectMongo();

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  // Body validation
  if (!req.body || typeof req.body.login !== "string" || typeof req.body.password !== "string") {
    return res.status(400).end();
  }

  try {
    const mongooseService = await MongooseService.getInstance();
    const userServices = mongooseService.userServices;
    const validUser = await userServices.findValidUser(req.body.login, req.body.password);

    if (!validUser) {
      return res.status(401).end();
    }

    const sessionServices = mongooseService.sessionServices;
    const session = await sessionServices.createSession({ user: validUser });

    return res.status(200).json({ session: session._id });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
