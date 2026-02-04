import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { ICenter } from "../../models";
import { Models } from "./mongoose.models";
import { centerSchema } from "./schema";

export type ICreateCenter = Omit<ICenter, '_id' | 'createdAt' | 'updatedAt'>;
export class CenterService {

    readonly mongooseService: MongooseService;
    readonly centerModel: Model<ICenter>;
    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.centerModel = this.mongooseService.mongoose.model(Models.Center, centerSchema);
    }

    async createCenter(center: ICreateCenter): Promise<ICenter> {
        return this.centerModel.create(center);
    }
}