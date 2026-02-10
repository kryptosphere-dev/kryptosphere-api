import { Schema } from "mongoose";
import { IImage } from "../../../models";

export const imageSchema = new Schema<IImage>({
    key: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    },
    altText: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    collection: 'images',
    versionKey: false  
})