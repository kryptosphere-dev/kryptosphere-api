import type { ITimestamp } from "./timestamp.interface";

export enum EventStatus {
  Draft = "draft",
  Published = "published",
  Cancelled = "cancelled",
  Archived = "archived",
}

export interface IEvent extends ITimestamp {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  subtitleFr?: string;
  subtitleEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  dateLabelFr?: string;
  dateLabelEn?: string;
  status: EventStatus;
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
}
