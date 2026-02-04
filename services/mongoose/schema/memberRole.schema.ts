import { Schema } from "mongoose";
import { IMemberRole } from "../../../models";

export const memberRoleSchema = new Schema<IMemberRole>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    boardId: {
        type: Schema.Types.ObjectId,
        required: false,
    },
    centerId: {
        type: Schema.Types.ObjectId,
        required: false,
    },
}, {
    timestamps: true,
    collection: 'member_roles',
    versionKey: false
})