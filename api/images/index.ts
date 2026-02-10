import { put } from "@vercel/blob";
import { connectMongo } from "../../lib/mongodb";
import { MongooseService } from "../../services/mongoose/mongoose.service";
import { jsonResponse, errorResponse, verifySession, sendUnauthorized } from "../../lib/middleware";

/**
 * Upload an image to Vercel Blob and store metadata in MongoDB.
 *
 * POST /api/images
 * Content-Type: multipart/form-data
 * Fields:
 *  - file: File (required)
 *  - key: string (required, unique identifier known by the website)
 *  - altText: string (optional)
 *  - description: string (optional)
 */
export async function POST(request: Request): Promise<Response> {
  try {
    // Ensure DB connection is ready (for metadata storage)
    await connectMongo();

    // Require authenticated user (restrict uploads)
    const user = await verifySession(request);
    if (!user) {
      return sendUnauthorized();
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return errorResponse("Missing or invalid 'file' field (multipart/form-data expected)", 400);
    }

    const key = formData.get("key");
    if (!key || typeof key !== "string") {
      return errorResponse("Missing or invalid 'key' field (string expected)", 400);
    }

    const altText = (formData.get("altText") as string) || undefined;
    const description = (formData.get("description") as string) || undefined;

    // Upload file to Vercel Blob
    const blob = await put(`images/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    // Store metadata in MongoDB
    const mongooseService = await MongooseService.getInstance();
    const imageServices = mongooseService.imageServices;

    const image = await imageServices.createImage({
      key,
      url: blob.url,
      altText,
      description,
    });

    return jsonResponse(
      {
        image,
        blob: {
          url: blob.url,
        },
      },
      201
    );
  } catch (error) {
    console.error("Image upload error:", error);
    return errorResponse("Failed to upload image", 500);
  }
}

/**
 * Get images metadata.
 *
 * GET /api/images
 * Query params:
 *  - id: string (optional) → return a single image by Mongo _id
 *  - limit: number (optional, default 50) → when listing images
 *
 * Usage côté website (pattern A) :
 *  - appeler /api/images?id=<id> ou /api/images?limit=20
 *  - utiliser image.url comme src dans les <img />.
 */
export async function GET(request: Request): Promise<Response> {
  try {
    await connectMongo();

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const limitParam = url.searchParams.get("limit");

    const mongooseService = await MongooseService.getInstance();
    const imageServices = mongooseService.imageServices;

    if (id) {
      const image = await imageServices.findImageById(id);
      if (!image) {
        return errorResponse("Image not found", 404);
      }
      return jsonResponse({ image });
    }

    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 50, 200) : 50;
    const images = await imageServices.listImages(limit);
    return jsonResponse({ images });
  } catch (error) {
    console.error("Image fetch error:", error);
    return errorResponse("Failed to fetch images", 500);
  }
}
