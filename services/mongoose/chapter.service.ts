import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { IChapter } from "../../models";
import { Models } from "./mongoose.models";
import { chapterSchema } from "./schema";

export type ICreateChapter = Omit<IChapter, '_id' | 'createdAt' | 'updatedAt'>;
export class ChapterService {

    readonly mongooseService: MongooseService;
    readonly chapterModel: Model<IChapter>;
    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.chapterModel = this.mongooseService.mongoose.model(Models.Chapter, chapterSchema);
    }

    async createChapter(chapter: ICreateChapter): Promise<IChapter> {
        return this.chapterModel.create(chapter);
    }
}