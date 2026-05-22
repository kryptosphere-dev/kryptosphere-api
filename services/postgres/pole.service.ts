import { PrismaClient } from "@prisma/client";
import { IPole } from "../../models";

export type ICreatePole = {
  slug: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string[];
  descriptionEn: string[];
  boardId: string;
  order?: number;
};

export class PoleService {
  constructor(private readonly prisma: PrismaClient) {}

  async createPole(data: ICreatePole): Promise<IPole> {
    return this.prisma.pole.create({ data }) as Promise<IPole>;
  }

  async findPoleById(id: string): Promise<IPole | null> {
    return this.prisma.pole.findUnique({ where: { id } }) as Promise<IPole | null>;
  }

  async listPolesByBoard(boardId: string): Promise<IPole[]> {
    return this.prisma.pole.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
    }) as Promise<IPole[]>;
  }
}
