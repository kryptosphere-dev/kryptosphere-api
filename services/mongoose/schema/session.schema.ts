import { Schema } from "mongoose";
import { ISession } from "../../../models";
import { Models } from "../mongoose.models";

export const sessionSchema = new Schema<ISession>({
    user: {
        type: Schema.Types.ObjectId,
        ref: Models.User,
        requiered: true
    }
}, {
    timestamps: true,
    collection: 'session',
    versionKey: false  
})