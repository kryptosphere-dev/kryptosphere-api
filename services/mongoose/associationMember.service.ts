import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { IAssociationMember } from "../../models";
import { Models } from "./mongoose.models";
import { associationMemberSchema } from "./schema";

export type ICreateAssociationMember = Omit<IAssociationMember, '_id' | 'createdAt' | 'updatedAt'>;
export class AssociationMemberService {

    readonly mongooseService: MongooseService;
    readonly associationMemberModel: Model<IAssociationMember>;
    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.associationMemberModel = this.mongooseService.mongoose.model(Models.AssociationMember, associationMemberSchema);
    }

    async createAssociationMember(associationMember: ICreateAssociationMember): Promise<IAssociationMember> {
        return this.associationMemberModel.create(associationMember);
    }
}