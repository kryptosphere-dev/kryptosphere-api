import type { ITimestamp } from "./timestamp.interface";

export interface IMemberRole extends ITimestamp {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  descriptionFr?: string;
  descriptionEn?: string;
}
