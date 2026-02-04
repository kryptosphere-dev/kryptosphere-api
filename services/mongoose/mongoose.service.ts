import { connect, Mongoose } from "mongoose";
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

    private static OpenConnection(): Promise<Mongoose> {

        return connect(process.env.MONGODB_URI as string, {
            auth: {
                username: process.env.MONGODB_USER,
                password: process.env.MONGODB_PWD
            },
            authSource: 'admin',
            dbName: process.env.MONGODB_DB as string,
        })
    }

    public static async getInstance(): Promise<MongooseService> {
        if (!MongooseService.instance) {
            const connection = await MongooseService.OpenConnection();
            MongooseService.instance = new MongooseService(connection);
        }

        return MongooseService.instance;
    }
}