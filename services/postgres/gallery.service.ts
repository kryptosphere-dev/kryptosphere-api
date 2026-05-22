import { PrismaClient } from "@prisma/client";
import { IGallery } from "../../models";

export type ICreateGallery = Record<string, never>;

export class GalleryService {
  constructor(private readonly prisma: PrismaClient) {}

  async createGallery(): Promise<IGallery> {
    return this.prisma.gallery.create({ data: {} }) as Promise<IGallery>;
  }

  async findGalleryById(id: string): Promise<IGallery | null> {
    return this.prisma.gallery.findUnique({
      where: { id },
      include: { items: { include: { image: true }, orderBy: { order: "asc" } } },
    }) as Promise<IGallery | null>;
  }

  async addImageToGallery(galleryId: string, imageId: string, order = 0, caption?: string): Promise<void> {
    await this.prisma.galleryImage.create({
      data: { galleryId, imageId, order, caption },
    });
  }
}
