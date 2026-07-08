import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async getZones() {
    return this.prisma.zone.findMany({ orderBy: { name: "asc" } });
  }

  async getWoredasByZone(zoneId: string) {
    return this.prisma.woreda.findMany({
      where: { zoneId },
      orderBy: { name: "asc" },
    });
  }

  async getKebelesByWoreda(woredaId: string) {
    return this.prisma.kebele.findMany({
      where: { woredaId },
      orderBy: { name: "asc" },
    });
  }

  async getLocationChain(kebeleId: string) {
    const kebele = await this.prisma.kebele.findUnique({
      where: { id: kebeleId },
      include: { woreda: { include: { zone: true } } },
    });
    if (!kebele) return null;
    return { zone: kebele.woreda.zone, woreda: kebele.woreda, kebele };
  }

  // -------------------------------------------------------------
  // ADMINISTRATIVE WORKSPACE MUTATION METHODS
  // -------------------------------------------------------------

  async createZone(data: { name: string }) {
    return this.prisma.zone.create({ data });
  }

  async updateZone(id: string, data: { name: string }) {
    return this.prisma.zone.update({ where: { id }, data });
  }

  async deleteZone(id: string) {
    const connected = await this.prisma.woreda.count({ where: { zoneId: id } });
    if (connected > 0)
      throw new BadRequestException(
        "Cannot delete a Zone that contains active Woredas.",
      );
    return this.prisma.zone.delete({ where: { id } });
  }

  async createWoreda(data: { name: string; zoneId: string }) {
    return this.prisma.woreda.create({ data });
  }

  async updateWoreda(id: string, data: { name: string; zoneId?: string }) {
    return this.prisma.woreda.update({ where: { id }, data });
  }

  async deleteWoreda(id: string) {
    const connected = await this.prisma.kebele.count({
      where: { woredaId: id },
    });
    if (connected > 0)
      throw new BadRequestException(
        "Cannot delete a Woreda that contains active Kebeles.",
      );
    return this.prisma.woreda.delete({ where: { id } });
  }

  async createKebele(data: { name: string; woredaId: string }) {
    return this.prisma.kebele.create({ data });
  }

  async updateKebele(id: string, data: { name: string; woredaId?: string }) {
    return this.prisma.kebele.update({ where: { id }, data });
  }

  async deleteKebele(id: string) {
    const connected = await this.prisma.site.count({ where: { kebeleId: id } });
    if (connected > 0)
      throw new BadRequestException(
        "Cannot delete a Kebele that has active mining sites assigned.",
      );
    return this.prisma.kebele.delete({ where: { id } });
  }
}
