import type { ITimestamp } from "./timestamp.interface";

export enum PublicationCategory {
  Kryptopaper = "kryptopaper",
  Article = "article",
  Rapport = "rapport",
  Etude = "etude",
}

export interface IPublication extends ITimestamp {
  id: string;
  slug: string;
  category: PublicationCategory;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  dateLabelFr?: string;
  dateLabelEn?: string;
  readTimeFr?: string;
  readTimeEn?: string;
  publishedAt?: Date;
  coverImageId?: string;
  downloadUrl?: string;
  order: number;
}
