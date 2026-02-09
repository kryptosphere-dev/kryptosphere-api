import { jsonResponse } from "../lib/middleware";

/**
 * Route de test pour vérifier que Vercel détecte bien les routes
 * GET /api/test
 */
export function GET(request: Request) {
  return jsonResponse({
    message: "API is working!",
    timestamp: new Date().toISOString(),
    method: request.method,
    path: new URL(request.url).pathname,
  });
}
