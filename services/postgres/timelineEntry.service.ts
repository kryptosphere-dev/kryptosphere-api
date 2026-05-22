import { PrismaClient } from "@prisma/client";
import { ITimelineEntry } from "../../models";

export type ICreateTimelineEntry = {
  year: number;
  order?: number;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  achievementsFr?: string[];
  achievementsEn?: string[];
};

export class TimelineEntryService {
  constructor(private readonly prisma: PrismaClient) {}

  async createTimelineEntry(data: ICreateTimelineEntry): Promise<ITimelineEntry> {
    return this.prisma.timelineEntry.create({ data }) as Promise<ITimelineEntry>;
  }

  async findTimelineEntryByYear(year: number): Promise<ITimelineEntry | null> {
    return this.prisma.timelineEntry.findUnique({ where: { year } }) as Promise<ITimelineEntry | null>;
  }

  async listTimelineEntries(): Promise<ITimelineEntry[]> {
    return this.prisma.timelineEntry.findMany({ orderBy: { year: "asc" } }) as Promise<ITimelineEntry[]>;
  }
}
