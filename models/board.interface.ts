import type { Types } from 'mongoose';
import type { IAssociationMember } from './associationMember.interface';
import type { ITimestamp } from './timestamp.interface';
import type { Ref } from "./types/ref.type";

export enum BoardType {
    CHAPTERBOARD = "chapter_board",
    MAINBOARD = "main_board"
}

export interface IBoard extends ITimestamp {
    _id: Types.ObjectId;
    year: number;
    name: string;
    type: BoardType;
    membersIds?: Ref<IAssociationMember>[];
}