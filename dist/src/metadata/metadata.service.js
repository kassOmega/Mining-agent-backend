"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let MetadataService = class MetadataService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSiteTypes() {
        return this.prisma.siteType.findMany({ orderBy: { label: "asc" } });
    }
    async getMineralTypes() {
        return this.prisma.mineralType.findMany({ orderBy: { label: "asc" } });
    }
    async createSiteType(dto) {
        const exists = await this.prisma.siteType.findUnique({
            where: { name: dto.name },
        });
        if (exists)
            throw new common_1.ConflictException("Site type already exists.");
        return this.prisma.siteType.create({ data: dto });
    }
    async createMineralType(dto) {
        const exists = await this.prisma.mineralType.findUnique({
            where: { name: dto.name },
        });
        if (exists)
            throw new common_1.ConflictException("Mineral category already exists.");
        return this.prisma.mineralType.create({ data: dto });
    }
    async updateSiteType(id, dto) {
        const item = await this.prisma.siteType.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException("Site type record target not found.");
        return this.prisma.siteType.update({ where: { id }, data: dto });
    }
    async deleteSiteType(id) {
        const item = await this.prisma.siteType.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException("Site type record target not found.");
        return this.prisma.siteType.delete({ where: { id } });
    }
    async updateMineralType(id, dto) {
        const item = await this.prisma.mineralType.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException("Mineral type record target not found.");
        return this.prisma.mineralType.update({ where: { id }, data: dto });
    }
    async deleteMineralType(id) {
        const item = await this.prisma.mineralType.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException("Mineral type record target not found.");
        return this.prisma.mineralType.delete({ where: { id } });
    }
};
exports.MetadataService = MetadataService;
exports.MetadataService = MetadataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MetadataService);
//# sourceMappingURL=metadata.service.js.map