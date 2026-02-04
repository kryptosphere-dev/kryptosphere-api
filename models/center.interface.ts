import type { Types } from "mongoose";
import type { IAssociationMember } from "./associationMember.interface";
import type { IBoard } from "./board.interface";
import type { ITimestamp } from "./timestamp.interface";
import type { Ref } from "./types/ref.type";

export enum CenterType {
    MAINBOARD = "main_board_center",
    CHAPTERBOARD = "chapter_board_center"
}

export interface ICenter extends ITimestamp {
    _id: Types.ObjectId;
    name: string;
    description: string;
    objective: string;
    type: CenterType;
    boardId: Ref<IBoard>;
    membersIds: Ref<IAssociationMember>[];
}