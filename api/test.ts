import { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Route de test pour vérifier que Vercel détecte bien les routes
 * GET /api/test
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ 
    message: "API is working!",
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.url
  });
}
