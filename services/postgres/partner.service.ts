import { PrismaClient } from "@prisma/client";
import { IPartner, PartnerCategory } from "../../models";

export type ICreatePartner = {
  name: string;
  websiteUrl?: string;
  logoId?: string;
  category: PartnerCategory;
  descriptionFr?: string;
  descriptionEn?: string;
};

export class PartnerService {
  constructor(private readonly prisma: PrismaClient) {}

  async createPartner(data: ICreatePartner): Promise<IPartner> {
    return this.prisma.partner.create({ data }) as Promise<IPartner>;
  }

  async findPartnerById(id: string): Promise<IPartner | null> {
    return this.prisma.partner.findUnique({ where: { id } }) as Promise<IPartner | null>;
  }

  async listPartners(category?: PartnerCategory): Promise<IPartner[]> {
    return this.prisma.partner.findMany({
      where: category ? { category } : undefined,
      orderBy: { name: "asc" },
    }) as Promise<IPartner[]>;
  }
}
