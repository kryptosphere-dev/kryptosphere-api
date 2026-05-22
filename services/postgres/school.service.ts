import { PrismaClient } from "@prisma/client";
import { ISchool } from "../../models";

export type ICreateSchool = {
  slug: string;
  name: string;
  address?: string;
  postalCode?: string;
  cityId?: string;
  countryId: string;
  websiteUrl?: string;
  logoId?: string;
};

export class SchoolService {
  constructor(private readonly prisma: PrismaClient) {}

  async createSchool(data: ICreateSchool): Promise<ISchool> {
    return this.prisma.school.create({ data }) as Promise<ISchool>;
  }

  async findSchoolById(id: string): Promise<ISchool | null> {
    return this.prisma.school.findUnique({ where: { id } }) as Promise<ISchool | null>;
  }

  async listSchools(): Promise<ISchool[]> {
    return this.prisma.school.findMany({ orderBy: { name: "asc" } }) as Promise<ISchool[]>;
  }
}
