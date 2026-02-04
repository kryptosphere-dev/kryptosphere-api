import { Schema } from "mongoose";
import { IPartner, PartnerType } from "../../../models";

export const partnerSchema = new Schema<IPartner>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    websiteUrl: {
        type: String,
        required: false
    },
    logoId: {
        type: Schema.Types.ObjectId,
        ref: 'Image',
        required: false
    },
    type: {
        type: String,
        enum: Object.values(PartnerType),
        required: true,
    }
}, {
    timestamps: true,
    collection: 'partners',
    versionKey: false  
})