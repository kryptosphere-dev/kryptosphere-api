import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { IImage } from "../../models";
import { Models } from "./mongoose.models";
import { imageSchema } from "./schema/image.schema";

export type ICreateImage = Omit<IImage, '_id' | 'createdAt' | 'updatedAt'>;

export class ImageService {
    readonly mongooseService: MongooseService;
    readonly imageModel: Model<IImage>;
    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.imageModel = this.mongooseService.mongoose.model(Models.Image, imageSchema);
    }
    async createImage(image: ICreateImage): Promise<IImage> {
        return this.imageModel.create(image);
    }
    async findImageById(id: string): Promise<IImage | null> {
        return this.imageModel.findById(id);
    }
    async findImageByKey(key: string): Promise<IImage | null> {
        return this.imageModel.findOne({ key });
    }
    async listImages(limit: number = 50): Promise<IImage[]> {
        return this.imageModel
            .find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
}