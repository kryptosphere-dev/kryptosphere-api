import type { Ref } from "./types/ref.type";
import type { IChapter } from "./chapter.interface";
import type { IMemberRole } from "./memberRole.interface";
import type { ITimestamp } from "./timestamp.interface";
import type { Types } from "mongoose";


export interface IAssociationMember extends ITimestamp {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    school: string;
    rolesIds: Ref<IMemberRole>[];
    description?: string;
    pictureUrl?: string;
    chapterId?: Ref<IChapter>;
    cotisationPaid: boolean;
    cotisationStartDate?: Date;
    cotisationEndDate?: Date;
}