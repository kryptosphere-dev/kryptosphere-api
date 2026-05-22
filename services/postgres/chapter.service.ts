import { PrismaClient } from "@prisma/client";
import { IChapter } from "../../models";

export type ICreateChapter = {
  slug: string;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  littleDescriptionFr: string;
  littleDescriptionEn: string;
  cityId: string;
  countryId: string;
  schoolId?: string;
  latitude?: number;
  longitude?: number;
  heroImageId?: string;
  logoId?: string;
  email?: string;
  phone?: string;
  address?: string;
  establishedDate?: Date;
  isActive?: boolean;
  galleryId?: string;
};

export class ChapterService {
  constructor(private readonly prisma: PrismaClient) {}

  async createChapter(data: ICreateChapter): Promise<IChapter> {
    return this.prisma.chapter.create({ data }) as Promise<IChapter>;
  }

  async findChapterById(id: string): Promise<IChapter | null> {
    return this.prisma.chapter.findUnique({ where: { id } }) as Promise<IChapter | null>;
  }

  async findChapterBySlug(slug: string): Promise<IChapter | null> {
    return this.prisma.chapter.findUnique({ where: { slug } }) as Promise<IChapter | null>;
  }

  async listChapters(activeOnly = false): Promise<IChapter[]> {
    return this.prisma.chapter.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { nameFr: "asc" },
    }) as Promise<IChapter[]>;
  }
}
