import type { ITimestamp } from "./timestamp.interface";

export interface IChapter extends ITimestamp {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  littleDescriptionFr: string;
  littleDescriptionEn: string;
  cityId: string;
  countryId: string;
  schoolId?: string;
  latitude?: number;
  longitude?: number;
  heroImageId?: string;
  logoId?: string;
  email?: string;
  phone?: string;
  address?: string;
  establishedDate?: Date;
  isActive: boolean;
  galleryId?: string;
}
