import { VercelRequest, VercelResponse } from "@vercel/node";
import { MongooseService } from "../services/mongoose";
import { IUser, IUserRole } from "../models";

// Extension of VercelRequest type to include user
export interface AuthenticatedRequest extends VercelRequest {
  user?: IUser;
}

/**
 * Middleware to verify user session
 * Adds req.user if session is valid
 */
export async function verifySession(
  req: AuthenticatedRequest
): Promise<IUser | null> {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return null;
  }

  const parts = authorization.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  const token = parts[1];
  const mongooseService = await MongooseService.getInstance();
  const sessionServices = mongooseService.sessionServices;
  const session = await sessionServices.findActiveSession(token);

  if (!session) {
    return null;
  }

  return session.user as IUser;
}

/**
 * Middleware to verify user role
 */
export function verifyRole(user: IUser | null, requiredRole: IUserRole): boolean {
  return user !== null && user.role === requiredRole;
}

/**
 * Helper to return a 401 error
 */
export function sendUnauthorized(res: VercelResponse) {
  return res.status(401).end();
}

/**
 * Helper to return a 403 error
 */
export function sendForbidden(res: VercelResponse) {
  return res.status(403).end();
}
