import { PrismaClient } from "@prisma/client";
import { IBoard, BoardType } from "../../models";

export type ICreateBoard = {
  type: BoardType;
  year: number;
  chapterId?: string;
};

export class BoardService {
  constructor(private readonly prisma: PrismaClient) {}

  async createBoard(data: ICreateBoard): Promise<IBoard> {
    return this.prisma.board.create({ data }) as Promise<IBoard>;
  }

  async findBoardById(id: string): Promise<IBoard | null> {
    return this.prisma.board.findUnique({ where: { id } }) as Promise<IBoard | null>;
  }

  async listBoards(): Promise<IBoard[]> {
    return this.prisma.board.findMany({ orderBy: { year: "desc" } }) as Promise<IBoard[]>;
  }
}
