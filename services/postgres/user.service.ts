import { PrismaClient } from "@prisma/client";
import { IUser, IUserRole } from "../../models";

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  async findUserByAuthId(authUserId: string): Promise<IUser | null> {
    return this.prisma.user.findUnique({ where: { authUserId } }) as Promise<IUser | null>;
  }

  async syncUser(authUserId: string): Promise<IUser> {
    return this.prisma.user.upsert({
      where: { authUserId },
      create: { authUserId, role: IUserRole.Viewer },
      update: {},
    }) as Promise<IUser>;
  }

  async updateRole(authUserId: string, role: IUserRole): Promise<IUser> {
    return this.prisma.user.update({
      where: { authUserId },
      data: { role },
    }) as Promise<IUser>;
  }

  async findSuperAdmin(): Promise<IUser | null> {
    return this.prisma.user.findFirst({
      where: { role: IUserRole.SuperAdmin },
    }) as Promise<IUser | null>;
  }
}
