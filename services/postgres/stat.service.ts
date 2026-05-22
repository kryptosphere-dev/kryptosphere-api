import { PrismaClient } from "@prisma/client";
import { IStat } from "../../models";

export type ICreateStat = {
  key: string;
  value: string;
  iconName?: string;
  order?: number;
  labelFr: string;
  labelEn: string;
};

export class StatService {
  constructor(private readonly prisma: PrismaClient) {}

  async createStat(data: ICreateStat): Promise<IStat> {
    return this.prisma.stat.create({ data }) as Promise<IStat>;
  }

  async findStatByKey(key: string): Promise<IStat | null> {
    return this.prisma.stat.findUnique({ where: { key } }) as Promise<IStat | null>;
  }

  async listStats(): Promise<IStat[]> {
    return this.prisma.stat.findMany({ orderBy: { order: "asc" } }) as Promise<IStat[]>;
  }
}
