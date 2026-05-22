import { PrismaClient } from "@prisma/client";
import { IMemberMandate } from "../../models";

export type ICreateMemberMandate = {
  memberId: string;
  roleId: string;
  boardId: string;
  poleId?: string;
  order?: number;
  startDate?: Date;
  endDate?: Date;
};

export class MemberMandateService {
  constructor(private readonly prisma: PrismaClient) {}

  async createMemberMandate(data: ICreateMemberMandate): Promise<IMemberMandate> {
    return this.prisma.memberMandate.create({ data }) as Promise<IMemberMandate>;
  }

  async findMemberMandateById(id: string): Promise<IMemberMandate | null> {
    return this.prisma.memberMandate.findUnique({ where: { id } }) as Promise<IMemberMandate | null>;
  }

  async listMandatesByBoard(boardId: string): Promise<IMemberMandate[]> {
    return this.prisma.memberMandate.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
    }) as Promise<IMemberMandate[]>;
  }

  async listMandatesByMember(memberId: string): Promise<IMemberMandate[]> {
    return this.prisma.memberMandate.findMany({
      where: { memberId },
      orderBy: { startDate: "desc" },
    }) as Promise<IMemberMandate[]>;
  }
}
