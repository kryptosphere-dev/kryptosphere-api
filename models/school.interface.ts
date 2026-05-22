import type { ITimestamp } from "./timestamp.interface";

export interface ISchool extends ITimestamp {
  id: string;
  slug: string;
  name: string;
  address?: string;
  postalCode?: string;
  cityId?: string;
  countryId: string;
  websiteUrl?: string;
  logoId?: string;
}
