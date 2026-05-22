import { PrismaClient } from "@prisma/client";
import { ICity } from "../../models";

export type ICreateCity = {
  slug: string;
  nameFr: string;
  nameEn: string;
  countryId: string;
  latitude?: number;
  longitude?: number;
};

export class CityService {
  constructor(private readonly prisma: PrismaClient) {}

  async createCity(data: ICreateCity): Promise<ICity> {
    return this.prisma.city.create({ data }) as Promise<ICity>;
  }

  async findCityById(id: string): Promise<ICity | null> {
    return this.prisma.city.findUnique({ where: { id } }) as Promise<ICity | null>;
  }

  async findCityBySlug(slug: string): Promise<ICity | null> {
    return this.prisma.city.findUnique({ where: { slug } }) as Promise<ICity | null>;
  }

  async listCities(countryId?: string): Promise<ICity[]> {
    return this.prisma.city.findMany({
      where: countryId ? { countryId } : undefined,
      orderBy: { nameFr: "asc" },
    }) as Promise<ICity[]>;
  }
}
