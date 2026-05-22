import { PrismaClient } from "@prisma/client";
import { IImage } from "../../models";

export type ICreateImage = Omit<IImage, "id" | "createdAt" | "updatedAt">;

export class ImageService {
  constructor(private readonly prisma: PrismaClient) {}

  async createImage(data: ICreateImage): Promise<IImage> {
    return this.prisma.image.create({ data }) as Promise<IImage>;
  }

  async findImageById(id: string): Promise<IImage | null> {
    return this.prisma.image.findUnique({ where: { id } }) as Promise<IImage | null>;
  }

  async findImageByKey(key: string): Promise<IImage | null> {
    return this.prisma.image.findUnique({ where: { key } }) as Promise<IImage | null>;
  }

  async listImages(limit: number = 50): Promise<IImage[]> {
    return this.prisma.image.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    }) as Promise<IImage[]>;
  }
}
