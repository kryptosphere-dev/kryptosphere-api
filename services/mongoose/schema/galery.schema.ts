import { Schema } from "mongoose";
import { IGalery } from "../../../models";

export const galerySchema = new Schema<IGalery>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    imagesIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    }]
}, {
    timestamps: true,
    collection: 'galeries',
    versionKey: false  
})