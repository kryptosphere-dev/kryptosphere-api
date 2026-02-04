import { Schema } from "mongoose";
import { ISchool } from "../../../models";

export const schoolSchema = new Schema<ISchool>({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    imageId: {
        type: Schema.Types.ObjectId,
        ref: 'Image',
        required: false
    },
    websiteUrl: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    collection: 'schools',
    versionKey: false  
})