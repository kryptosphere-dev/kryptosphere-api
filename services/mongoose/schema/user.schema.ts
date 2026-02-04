import { Schema } from "mongoose";
import { IUser, IUserRole } from "../../../models";
import { Models } from "../mongoose.models";

export const userSchema = new Schema<IUser>({
    role: {
        type: String,
        enum: Object.values(IUserRole),
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    login: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }, 
}, {
    timestamps: true,
    collection: 'user',
    versionKey: false
})