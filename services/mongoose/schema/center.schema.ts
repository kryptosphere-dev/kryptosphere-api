import { Schema } from "mongoose";
import { ICenter, CenterType } from "../../../models";

export const centerSchema = new Schema<ICenter>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    objective: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(CenterType),
        required: true,
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    membersIds: [{
        type: Schema.Types.ObjectId,
        ref: 'AssociationMember',
    }],
}, {
    timestamps: true,
    collection: 'centers',
    versionKey: false
})