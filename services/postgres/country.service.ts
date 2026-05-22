import { PrismaClient } from "@prisma/client";
import { ICountry } from "../../models";

export type ICreateCountry = {
  code: string;
  nameFr: string;
  nameEn: string;
};

export class CountryService {
  constructor(private readonly prisma: PrismaClient) {}

  async createCountry(data: ICreateCountry): Promise<ICountry> {
    return this.prisma.country.create({ data }) as Promise<ICountry>;
  }

  async findCountryById(id: string): Promise<ICountry | null> {
    return this.prisma.country.findUnique({ where: { id } }) as Promise<ICountry | null>;
  }

  async findCountryByCode(code: string): Promise<ICountry | null> {
    return this.prisma.country.findUnique({ where: { code } }) as Promise<ICountry | null>;
  }

  async listCountries(): Promise<ICountry[]> {
    return this.prisma.country.findMany({ orderBy: { nameFr: "asc" } }) as Promise<ICountry[]>;
  }
}
