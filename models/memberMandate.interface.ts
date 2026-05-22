import type { ITimestamp } from "./timestamp.interface";

export interface IMemberMandate extends ITimestamp {
  id: string;
  memberId: string;
  roleId: string;
  boardId: string;
  poleId?: string;
  order: number;
  startDate: Date;
  endDate?: Date;
}
