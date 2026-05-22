import type { ITimestamp } from "./timestamp.interface";

export interface ISpeaker extends ITimestamp {
  id: string;
  firstName: string;
  lastName: string;
  pictureId?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  roleFr?: string;
  roleEn?: string;
  companyFr?: string;
  companyEn?: string;
  bioFr?: string;
  bioEn?: string;
}
