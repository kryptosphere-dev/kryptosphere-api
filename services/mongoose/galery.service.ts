import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { IGalery } from "../../models";
import { Models } from "./mongoose.models";
import { galerySchema } from "./schema/galery.schema";

export type ICreateGalery = Omit<IGalery, '_id' | 'createdAt' | 'updatedAt'>;
export class GaleryService {

    readonly mongooseService: MongooseService;
    readonly galeryModel: Model<IGalery>;
    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.galeryModel = this.mongooseService.mongoose.model(Models.Galery, galerySchema);
    }
    async createGalery(galery: ICreateGalery): Promise<IGalery> {
        return this.galeryModel.create(galery);
    }
}