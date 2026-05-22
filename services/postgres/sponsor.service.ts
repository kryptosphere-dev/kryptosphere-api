import { PrismaClient } from "@prisma/client";
import { ISponsor } from "../../models";

export type ICreateSponsor = {
  name: string;
  websiteUrl?: string;
  logoId?: string;
};

export class SponsorService {
  constructor(private readonly prisma: PrismaClient) {}

  async createSponsor(data: ICreateSponsor): Promise<ISponsor> {
    return this.prisma.sponsor.create({ data }) as Promise<ISponsor>;
  }

  async findSponsorById(id: string): Promise<ISponsor | null> {
    return this.prisma.sponsor.findUnique({ where: { id } }) as Promise<ISponsor | null>;
  }

  async listSponsors(): Promise<ISponsor[]> {
    return this.prisma.sponsor.findMany({ orderBy: { name: "asc" } }) as Promise<ISponsor[]>;
  }
}
