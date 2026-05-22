import { PrismaClient } from "@prisma/client";
import { IAssociationSection } from "../../models";

export type ICreateAssociationSection = {
  key: string;
  order?: number;
  titleFr: string;
  titleEn: string;
  bodyFr: string;
  bodyEn: string;
};

export class AssociationSectionService {
  constructor(private readonly prisma: PrismaClient) {}

  async createAssociationSection(data: ICreateAssociationSection): Promise<IAssociationSection> {
    return this.prisma.associationSection.create({ data }) as Promise<IAssociationSection>;
  }

  async findAssociationSectionByKey(key: string): Promise<IAssociationSection | null> {
    return this.prisma.associationSection.findUnique({ where: { key } }) as Promise<IAssociationSection | null>;
  }

  async listAssociationSections(): Promise<IAssociationSection[]> {
    return this.prisma.associationSection.findMany({ orderBy: { order: "asc" } }) as Promise<IAssociationSection[]>;
  }
}
