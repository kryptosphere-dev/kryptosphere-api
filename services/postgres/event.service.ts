import { PrismaClient } from "@prisma/client";
import { IEvent, EventStatus } from "../../models";

export type ICreateEvent = {
  slug: string;
  titleFr: string;
  titleEn: string;
  subtitleFr?: string;
  subtitleEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  dateLabelFr?: string;
  dateLabelEn?: string;
  status?: EventStatus;
  startDate: Date;
  endDate?: Date;
  cityId?: string;
  venue?: string;
  chapterId?: string;
  coverImageId?: string;
  lumaUrl?: string;
  lumaEventId?: string;
  internalRoute?: string;
  galleryId?: string;
};

export class EventService {
  constructor(private readonly prisma: PrismaClient) {}

  async createEvent(data: ICreateEvent): Promise<IEvent> {
    return this.prisma.event.create({ data }) as Promise<IEvent>;
  }

  async findEventById(id: string): Promise<IEvent | null> {
    return this.prisma.event.findUnique({ where: { id } }) as Promise<IEvent | null>;
  }

  async findEventBySlug(slug: string): Promise<IEvent | null> {
    return this.prisma.event.findUnique({ where: { slug } }) as Promise<IEvent | null>;
  }

  async listEvents(status?: EventStatus): Promise<IEvent[]> {
    return this.prisma.event.findMany({
      where: status ? { status } : undefined,
      orderBy: { startDate: "desc" },
    }) as Promise<IEvent[]>;
  }
}
