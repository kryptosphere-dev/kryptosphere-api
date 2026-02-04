import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { IUser } from "../../models";
import { Models } from "./mongoose.models";
import { userSchema } from "./schema";
import { SecurityUtils } from "../../utils";

// Omit permet de créer un type qui est une copie de IUser sans les propriétés spécifiées
export type ICreateUser = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>;

export class UserService {

    readonly mongooseService: MongooseService;
    readonly userModel: Model<IUser>;

    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.userModel = this.mongooseService.mongoose.model(Models.User, userSchema);
    }

    async createUser(user: ICreateUser): Promise<IUser> {
        user.password = SecurityUtils.sha256(user.password);
        return this.userModel.create(user); // Création de l'utilisateur en base de données
    }

    async findUserByLogin(login: string): Promise<IUser | null> {
        // findOne permet de récupérer un enregistrement en base de données avec un filtre
        // la condition de filtre utilise le mot clé AND entre chaque propriété
        return this.userModel.findOne({ login: login });
    }

    async findValidUser(login: string, password: string): Promise<IUser | null> {
        const passwordHash = SecurityUtils.sha256(password);
        return this.userModel.findOne({ 
            login: login, 
            password: passwordHash 
        });
    }
}