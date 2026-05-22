import type { ITimestamp } from "./timestamp.interface";

export enum IUserRole {
  SuperAdmin = "super_admin",
  Admin = "admin",
  Editor = "editor",
  Viewer = "viewer",
}

export interface IUser extends ITimestamp {
  id: string;
  authUserId: string;
  role: IUserRole;
}
