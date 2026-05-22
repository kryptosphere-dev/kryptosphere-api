import { PrismaClient } from "@prisma/client";
import { IAssociationMember } from "../../models";

export type ICreateAssociationMember = {
  firstName: string;
  lastName: string;
  email?: string;
  pictureId?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  schoolId?: string;
  userId?: string;
  cotisationPaid?: boolean;
  cotisationStartDate?: Date;
  cotisationEndDate?: Date;
};

export class AssociationMemberService {
  constructor(private readonly prisma: PrismaClient) {}

  async createAssociationMember(data: ICreateAssociationMember): Promise<IAssociationMember> {
    return this.prisma.associationMember.create({ data }) as Promise<IAssociationMember>;
  }

  async findAssociationMemberById(id: string): Promise<IAssociationMember | null> {
    return this.prisma.associationMember.findUnique({ where: { id } }) as Promise<IAssociationMember | null>;
  }

  async listAssociationMembers(): Promise<IAssociationMember[]> {
    return this.prisma.associationMember.findMany({
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    }) as Promise<IAssociationMember[]>;
  }
}
