import type { ITimestamp } from "./timestamp.interface";

export interface IAssociationMember extends ITimestamp {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  pictureId?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  schoolId?: string;
  userId?: string;
  cotisationPaid: boolean;
  cotisationStartDate?: Date;
  cotisationEndDate?: Date;
}
