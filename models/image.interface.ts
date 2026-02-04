import type { Types } from "mongoose";
import type { ITimestamp } from "./timestamp.interface";

export interface IImage extends ITimestamp {
    _id: Types.ObjectId;
    url: string;
    altText?: string;
    description?: string;
}