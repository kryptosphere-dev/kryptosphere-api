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
}