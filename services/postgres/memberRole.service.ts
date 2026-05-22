import { PrismaClient } from "@prisma/client";
import { IMemberRole } from "../../models";

export type ICreateMemberRole = {
  slug: string;
  nameFr: string;
  nameEn: string;
  descriptionFr?: string;
  descriptionEn?: string;
};

export class MemberRoleService {
  constructor(private readonly prisma: PrismaClient) {}

  async createMemberRole(data: ICreateMemberRole): Promise<IMemberRole> {
    return this.prisma.memberRole.create({ data }) as Promise<IMemberRole>;
  }

  async findMemberRoleById(id: string): Promise<IMemberRole | null> {
    return this.prisma.memberRole.findUnique({ where: { id } }) as Promise<IMemberRole | null>;
  }

  async listMemberRoles(): Promise<IMemberRole[]> {
    return this.prisma.memberRole.findMany({ orderBy: { nameFr: "asc" } }) as Promise<IMemberRole[]>;
  }
}
