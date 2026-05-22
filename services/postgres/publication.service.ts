import { PrismaClient } from "@prisma/client";
import { IPublication, PublicationCategory } from "../../models";

export type ICreatePublication = {
  slug: string;
  category: PublicationCategory;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  dateLabelFr?: string;
  dateLabelEn?: string;
  readTimeFr?: string;
  readTimeEn?: string;
  publishedAt?: Date;
  coverImageId?: string;
  downloadUrl?: string;
  order?: number;
};

export class PublicationService {
  constructor(private readonly prisma: PrismaClient) {}

  async createPublication(data: ICreatePublication): Promise<IPublication> {
    return this.prisma.publication.create({ data }) as Promise<IPublication>;
  }

  async findPublicationById(id: string): Promise<IPublication | null> {
    return this.prisma.publication.findUnique({ where: { id } }) as Promise<IPublication | null>;
  }

  async listPublications(category?: PublicationCategory): Promise<IPublication[]> {
    return this.prisma.publication.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    }) as Promise<IPublication[]>;
  }
}
