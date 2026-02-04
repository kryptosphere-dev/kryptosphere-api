import type { Types } from "mongoose";
import type { ITimestamp } from "./timestamp.interface";
import type { Ref } from "./types/ref.type";
import type { IImage } from "./image.interface";

export enum PartnerType {
    Sponsor = "sponsor",
    Media = "media",
    School = "school",
    Partner = "partner"
}

export interface IPartner extends ITimestamp {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    websiteUrl?: string;
    logoId?: Ref<IImage>;
    type: PartnerType;
}