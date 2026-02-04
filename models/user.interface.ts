import type { Types } from "mongoose";
import type { ITimestamp } from "./timestamp.interface";

export enum IUserRole {
    SuperAdmin = "super_admin",
    Admin = "admin",
    Employee = "employee",
    Customer = "customer"
}

export interface IUser extends ITimestamp {
    _id: Types.ObjectId
    role: IUserRole;
    lastName: string;
    firstName: string;
    login: string;
    password: string;
    email: string;
}