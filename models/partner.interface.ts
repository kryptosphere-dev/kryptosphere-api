import type { ITimestamp } from "./timestamp.interface";

export enum PartnerCategory {
  Sponsor = "sponsor",
  Media = "media",
  Community = "community",
  Institutional = "institutional",
}

export interface IPartner extends ITimestamp {
  id: string;
  name: string;
  websiteUrl?: string;
  logoId?: string;
  category: PartnerCategory;
  descriptionFr?: string;
  descriptionEn?: string;
}
