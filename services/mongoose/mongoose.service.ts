import mongoose, { Mongoose } from "mongoose";
import { connectMongo } from "../../lib/mongodb";
import { UserService } from "./user.service";
import { SessionService } from "./session.service";
import { BoardService } from "./board.service";
import { MemberRoleService } from "./memberRole.service";
import { AssociationMemberService } from "./associationMember.service";
import { ChapterService } from "./chapter.service";
import { CenterService } from "./center.service";


export class MongooseService {
    public mongoose: Mongoose;
    private static instance: MongooseService;
    public userServices: UserService;
    public sessionServices: SessionService;
    public boardServices: BoardService;
    public memberRoleServices: MemberRoleService;
    public associationMemberServices: AssociationMemberService;
    public chapterServices: ChapterService;
    public centerServices: CenterService;

    private constructor(mongoose: Mongoose) {
        this.mongoose = mongoose;
        this.userServices = new UserService(this);
        this.sessionServices = new SessionService(this);
        this.boardServices = new BoardService(this);
        this.memberRoleServices = new MemberRoleService(this);
        this.associationMemberServices = new AssociationMemberService(this);
        this.chapterServices = new ChapterService(this);
        this.centerServices = new CenterService(this);
    }

    public static async getInstance(): Promise<MongooseService> {
        if (!MongooseService.instance) {
            // Use cached connection for serverless
            const connection = await connectMongo();
            MongooseService.instance = new MongooseService(connection as Mongoose);
        }

        return MongooseService.instance;
    }
}