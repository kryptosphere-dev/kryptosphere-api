import type { ITimestamp } from "./timestamp.interface";

export interface ITimelineEntry extends ITimestamp {
  id: string;
  year: number;
  order: number;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  achievementsFr: string[];
  achievementsEn: string[];
}
