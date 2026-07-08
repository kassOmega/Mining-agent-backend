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
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let LocationsService = class LocationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getZones() {
        return this.prisma.zone.findMany({ orderBy: { name: "asc" } });
    }
    async getWoredasByZone(zoneId) {
        return this.prisma.woreda.findMany({
            where: { zoneId },
            orderBy: { name: "asc" },
        });
    }
    async getKebelesByWoreda(woredaId) {
        return this.prisma.kebele.findMany({
            where: { woredaId },
            orderBy: { name: "asc" },
        });
    }
    async getLocationChain(kebeleId) {
        const kebele = await this.prisma.kebele.findUnique({
            where: { id: kebeleId },
            include: { woreda: { include: { zone: true } } },
        });
        if (!kebele)
            return null;
        return { zone: kebele.woreda.zone, woreda: kebele.woreda, kebele };
    }
    async createZone(data) {
        return this.prisma.zone.create({ data });
    }
    async updateZone(id, data) {
        return this.prisma.zone.update({ where: { id }, data });
    }
    async deleteZone(id) {
        const connected = await this.prisma.woreda.count({ where: { zoneId: id } });
        if (connected > 0)
            throw new common_1.BadRequestException("Cannot delete a Zone that contains active Woredas.");
        return this.prisma.zone.delete({ where: { id } });
    }
    async createWoreda(data) {
        return this.prisma.woreda.create({ data });
    }
    async updateWoreda(id, data) {
        return this.prisma.woreda.update({ where: { id }, data });
    }
    async deleteWoreda(id) {
        const connected = await this.prisma.kebele.count({
            where: { woredaId: id },
        });
        if (connected > 0)
            throw new common_1.BadRequestException("Cannot delete a Woreda that contains active Kebeles.");
        return this.prisma.woreda.delete({ where: { id } });
    }
    async createKebele(data) {
        return this.prisma.kebele.create({ data });
    }
    async updateKebele(id, data) {
        return this.prisma.kebele.update({ where: { id }, data });
    }
    async deleteKebele(id) {
        const connected = await this.prisma.site.count({ where: { kebeleId: id } });
        if (connected > 0)
            throw new common_1.BadRequestException("Cannot delete a Kebele that has active mining sites assigned.");
        return this.prisma.kebele.delete({ where: { id } });
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationsService);
//# sourceMappingURL=locations.service.js.map