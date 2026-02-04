import type { Types } from "mongoose";
import type { IBoard } from "./board.interface";
import type { ICenter } from "./center.interface";
import type { ITimestamp } from "./timestamp.interface";
import type { IGalery } from "./galery.interface";
import type { Ref } from "./types/ref.type";

export interface IChapter extends ITimestamp {
    _id: Types.ObjectId;
    name: string;
    location: string;
    establishedDate: Date;
    isActive: boolean;
    boardId: Ref<IBoard>;
    membersCount: number;
    centerIds?: Ref<ICenter>[];
    galeryIds?: Ref<IGalery>[];
}