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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const create_metadata_dto_1 = require("./dto/create-metadata.dto");
const update_metadata_dto_1 = require("./dto/update-metadata.dto");
const metadata_service_1 = require("./metadata.service");
let MetadataController = class MetadataController {
    constructor(metadataService) {
        this.metadataService = metadataService;
    }
    async getSiteTypes() {
        return this.metadataService.getSiteTypes();
    }
    async getMineralTypes() {
        return this.metadataService.getMineralTypes();
    }
    async createSiteType(dto) {
        return this.metadataService.createSiteType(dto);
    }
    async createMineralType(dto) {
        return this.metadataService.createMineralType(dto);
    }
    async updateSiteType(id, dto) {
        return this.metadataService.updateSiteType(id, dto);
    }
    async deleteSiteType(id) {
        return this.metadataService.deleteSiteType(id);
    }
    async updateMineralType(id, dto) {
        return this.metadataService.updateMineralType(id, dto);
    }
    async deleteMineralType(id) {
        return this.metadataService.deleteMineralType(id);
    }
};
exports.MetadataController = MetadataController;
__decorate([
    (0, common_1.Get)("site-types"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "getSiteTypes", null);
__decorate([
    (0, common_1.Get)("mineral-types"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "getMineralTypes", null);
__decorate([
    (0, common_1.Post)("site-types"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_metadata_dto_1.CreateMetadataDto]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "createSiteType", null);
__decorate([
    (0, common_1.Post)("mineral-types"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_metadata_dto_1.CreateMetadataDto]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "createMineralType", null);
__decorate([
    (0, common_1.Patch)("site-types/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_metadata_dto_1.UpdateMetadataDto]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "updateSiteType", null);
__decorate([
    (0, common_1.Delete)("site-types/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "deleteSiteType", null);
__decorate([
    (0, common_1.Patch)("mineral-types/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_metadata_dto_1.UpdateMetadataDto]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "updateMineralType", null);
__decorate([
    (0, common_1.Delete)("mineral-types/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "deleteMineralType", null);
exports.MetadataController = MetadataController = __decorate([
    (0, common_1.Controller)("metadata"),
    __metadata("design:paramtypes", [metadata_service_1.MetadataService])
], MetadataController);
//# sourceMappingURL=metadata.controller.js.map