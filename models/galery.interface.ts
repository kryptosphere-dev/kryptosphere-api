import { Types } from "mongoose";
import type { ITimestamp } from "./timestamp.interface";
import type { IImage } from "./image.interface";
import type { Ref } from "./types/ref.type";

export interface IGalery extends ITimestamp {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    imagesIds: Ref<IImage>[];
}