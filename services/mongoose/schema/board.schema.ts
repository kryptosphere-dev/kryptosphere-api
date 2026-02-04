import { Schema } from "mongoose";
import { BoardType, IBoard } from "../../../models";

export const boardSchema = new Schema<IBoard>({
    name: {
        type: String, 
        required: true
    },
    type: {
        type: String,
        enum: Object.values(BoardType),
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    membersIds: [{
        type: Schema.Types.ObjectId,
        ref: 'AssociationMember'
    }]
}, {
    timestamps: true,
    collection: 'boards',
    versionKey: false  
})