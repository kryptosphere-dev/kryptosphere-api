import type { Types } from "mongoose";
import type { ITimestamp } from "./timestamp.interface";

export interface IMemberRole extends ITimestamp {
    _id: Types.ObjectId;
    name: string;
    description: string;
    boardId?: Types.ObjectId;
    centerId?: Types.ObjectId;
}