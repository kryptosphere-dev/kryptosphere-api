import { Schema } from "mongoose";
import { IChapter } from "../../../models";

export const chapterSchema = new Schema<IChapter>({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    establishedDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    membersCount: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true,
    collection: 'chapters',
    versionKey: false
})