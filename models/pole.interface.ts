import type { ITimestamp } from "./timestamp.interface";

export interface IPole extends ITimestamp {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string[];
  descriptionEn: string[];
  boardId: string;
  order: number;
}
