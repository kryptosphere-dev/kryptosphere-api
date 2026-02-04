import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { ISchool } from "../../models";
import { Models } from "./mongoose.models";
import { schoolSchema } from "./schema/school.schema";

export type ICreateSchool = Omit<ISchool, '_id' | 'createdAt' | 'updatedAt'>;

export class SchoolService {
    readonly mongooseService: MongooseService;
    readonly schoolModel: Model<ISchool>;
    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.schoolModel = this.mongooseService.mongoose.model(Models.School, schoolSchema);
    }
    async createSchool(school: ICreateSchool): Promise<ISchool> {
        return this.schoolModel.create(school);
    }
}