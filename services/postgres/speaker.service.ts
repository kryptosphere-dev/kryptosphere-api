import { PrismaClient } from "@prisma/client";
import { ISpeaker } from "../../models";

export type ICreateSpeaker = {
  firstName: string;
  lastName: string;
  pictureId?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  roleFr?: string;
  roleEn?: string;
  companyFr?: string;
  companyEn?: string;
  bioFr?: string;
  bioEn?: string;
};

export class SpeakerService {
  constructor(private readonly prisma: PrismaClient) {}

  async createSpeaker(data: ICreateSpeaker): Promise<ISpeaker> {
    return this.prisma.speaker.create({ data }) as Promise<ISpeaker>;
  }

  async findSpeakerById(id: string): Promise<ISpeaker | null> {
    return this.prisma.speaker.findUnique({ where: { id } }) as Promise<ISpeaker | null>;
  }

  async listSpeakers(): Promise<ISpeaker[]> {
    return this.prisma.speaker.findMany({
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    }) as Promise<ISpeaker[]>;
  }
}
