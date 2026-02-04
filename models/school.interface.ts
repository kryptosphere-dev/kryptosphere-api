import type { Types } from "mongoose";
import type { ITimestamp } from "./timestamp.interface";
import type { IImage } from "./image.interface";
import type { Ref } from "./types/ref.type";

export interface ISchool extends ITimestamp {
    _id: Types.ObjectId;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    imageId?: Ref<IImage>;
    websiteUrl?: string;
}