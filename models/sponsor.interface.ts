import type { ITimestamp } from "./timestamp.interface";

export enum SponsorTier {
  Platinum = "platinum",
  Gold = "gold",
  Silver = "silver",
  Bronze = "bronze",
}

export interface ISponsor extends ITimestamp {
  id: string;
  name: string;
  websiteUrl?: string;
  logoId?: string;
}
