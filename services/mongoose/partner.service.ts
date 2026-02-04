import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { IPartner } from "../../models";
import { Models } from "./mongoose.models";
import { partnerSchema } from "./schema/partner.schema";

export type ICreatePartner = Omit<IPartner, '_id' | 'createdAt' | 'updatedAt'>;

export class PartnerService {
    readonly mongooseService: MongooseService;
    readonly partnerModel: Model<IPartner>;
    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.partnerModel = this.mongooseService.mongoose.model(Models.Partner, partnerSchema);
    }
    async createPartner(partner: ICreatePartner): Promise<IPartner> {
        return this.partnerModel.create(partner);
    }
}