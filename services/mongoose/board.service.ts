import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { IBoard } from "../../models";
import { Models } from "./mongoose.models";
import { boardSchema } from "./schema";

export type ICreateBoard = Omit<IBoard, '_id' | 'createdAt' | 'updatedAt'>;
export class BoardService {

    readonly mongooseService: MongooseService;
    readonly boardModel: Model<IBoard>;
    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.boardModel = this.mongooseService.mongoose.model(Models.Board, boardSchema);
    }

    async createBoard(board: ICreateBoard): Promise<IBoard> {
        return this.boardModel.create(board);
    }
}