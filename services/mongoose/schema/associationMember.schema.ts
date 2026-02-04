import { Schema } from "mongoose";
import { IAssociationMember } from "../../../models";
import { Models } from "../mongoose.models";

export const associationMemberSchema = new Schema<IAssociationMember>({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    rolesIds: [{
        type: Schema.Types.ObjectId,
        ref: Models.MemberRole,
        required: false,
    }],
    school: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    pictureUrl: {
        type: String,
        required: false,
    },
    chapterId: {
        type: Schema.Types.ObjectId,
        ref: Models.Chapter,
        required: false,
    },
    cotisationPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    cotisationStartDate: {
        type: Date,
        required: false,
    },
    cotisationEndDate: {
        type: Date,
        required: false,
    },
}, {
    timestamps: true,
    collection: 'association_members',
    versionKey: false
})