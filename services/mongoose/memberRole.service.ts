import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { IMemberRole } from "../../models";
import { Models } from "./mongoose.models";
import { memberRoleSchema } from "./schema";

export type ICreateMemberRole = Omit<IMemberRole, '_id' | 'createdAt' | 'updatedAt'>;
export class MemberRoleService {
    readonly mongooseService: MongooseService;
    readonly memberRoleModel: Model<IMemberRole>;
    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.memberRoleModel = this.mongooseService.mongoose.model(Models.MemberRole, memberRoleSchema);
    }

    async createMemberRole(memberRole: ICreateMemberRole): Promise<IMemberRole> {
        return this.memberRoleModel.create(memberRole);
    }
}