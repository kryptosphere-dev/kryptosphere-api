import { MongooseService } from "../services/mongoose/mongoose.service";
import { IUser, IUserRole } from "../models";

/**
 * Middleware to verify user session from Request
 * Returns user if session is valid, null otherwise
 */
export async function verifySession(request: Request): Promise<IUser | null> {
  const authorization = request.headers.get("authorization");
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
export function sendUnauthorized(): Response {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Helper to return a 403 error
 */
export function sendForbidden(): Response {
  return new Response(JSON.stringify({ error: "Forbidden" }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Helper to return a JSON response
 */
export function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Helper to return an error response
 */
export function errorResponse(message: string, status: number = 500): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
