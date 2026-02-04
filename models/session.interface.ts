import type { Types } from 'mongoose';
import type { ITimestamp } from './timestamp.interface';
import type { IUser } from './user.interface';
import type { Ref } from "./types/ref.type";

export interface ISession extends ITimestamp {
        _id: Types.ObjectId;
        user: string | Ref<IUser>;
}