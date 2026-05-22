import type { ITimestamp } from "./timestamp.interface";

export enum BoardType {
  Main = "main",
  Chapter = "chapter",
}

export interface IBoard extends ITimestamp {
  id: string;
  type: BoardType;
  year: number;
  chapterId?: string;
}
