import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { CreateMetadataDto } from "./dto/create-metadata.dto";
import { UpdateMetadataDto } from "./dto/update-metadata.dto";

@Injectable()
export class MetadataService {
  constructor(private prisma: PrismaService) {}

  async getSiteTypes() {
    return this.prisma.siteType.findMany({ orderBy: { label: "asc" } });
  }

  async getMineralTypes() {
    return this.prisma.mineralType.findMany({ orderBy: { label: "asc" } });
  }

  async createSiteType(dto: CreateMetadataDto) {
    const exists = await this.prisma.siteType.findUnique({
      where: { name: dto.name },
    });
    if (exists) throw new ConflictException("Site type already exists.");
    return this.prisma.siteType.create({ data: dto });
  }

  async createMineralType(dto: CreateMetadataDto) {
    const exists = await this.prisma.mineralType.findUnique({
      where: { name: dto.name },
    });
    if (exists) throw new ConflictException("Mineral category already exists.");
    return this.prisma.mineralType.create({ data: dto });
  }

  // Admin mutation pipelines
  async updateSiteType(id: string, dto: UpdateMetadataDto) {
    const item = await this.prisma.siteType.findUnique({ where: { id } });
    if (!item)
      throw new NotFoundException("Site type record target not found.");
    return this.prisma.siteType.update({ where: { id }, data: dto });
  }

  async deleteSiteType(id: string) {
    const item = await this.prisma.siteType.findUnique({ where: { id } });
    if (!item)
      throw new NotFoundException("Site type record target not found.");
    return this.prisma.siteType.delete({ where: { id } });
  }

  async updateMineralType(id: string, dto: UpdateMetadataDto) {
    const item = await this.prisma.mineralType.findUnique({ where: { id } });
    if (!item)
      throw new NotFoundException("Mineral type record target not found.");
    return this.prisma.mineralType.update({ where: { id }, data: dto });
  }

  async deleteMineralType(id: string) {
    const item = await this.prisma.mineralType.findUnique({ where: { id } });
    if (!item)
      throw new NotFoundException("Mineral type record target not found.");
    return this.prisma.mineralType.delete({ where: { id } });
  }
}
