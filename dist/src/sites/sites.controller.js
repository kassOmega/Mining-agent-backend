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
exports.SitesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fs = require("fs");
const multer_1 = require("multer");
const path = require("path");
const uuid_1 = require("uuid");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const subscription_guard_1 = require("../common/guards/subscription.guard");
const create_site_dto_1 = require("./dto/create-site.dto");
const sites_service_1 = require("./sites.service");
const pictureFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new common_1.BadRequestException("Only image files are allowed for pictures"), false);
    }
};
const videoFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
        cb(null, true);
    }
    else {
        cb(new common_1.BadRequestException("Only video files are allowed"), false);
    }
};
const receiptFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new common_1.BadRequestException("Only image files are allowed for payment receipts"), false);
    }
};
const receiptStorage = {
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), "public", "receipts");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `receipt-${(0, uuid_1.v4)()}${ext}`;
        cb(null, filename);
    },
};
const documentFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("application/") ||
        file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new common_1.BadRequestException("Only document or image files are allowed"), false);
    }
};
const documentStorage = {
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), "public", "documents");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${(0, uuid_1.v4)()}${ext}`;
        cb(null, filename);
    },
};
const pictureStorage = {
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), "public", "pictures");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${(0, uuid_1.v4)()}${ext}`;
        cb(null, filename);
    },
};
const videoStorage = {
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), "public", "videos");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${(0, uuid_1.v4)()}${ext}`;
        cb(null, filename);
    },
};
let SitesController = class SitesController {
    constructor(sitesService) {
        this.sitesService = sitesService;
    }
    async getPublicSites(query) {
        return this.sitesService.getPublicSites(query);
    }
    async getPublicSite(id) {
        return this.sitesService.getPublicSite(id);
    }
    async createSite(user, dto) {
        return this.sitesService.createSite(user.id, dto, user.role);
    }
    async getMySites(user) {
        return this.sitesService.getMySites(user.id);
    }
    async updateSite(user, id, dto) {
        return this.sitesService.updateSite(user.id, id, dto, user.role);
    }
    async deleteSite(user, id) {
        return this.sitesService.deleteSite(user.id, id, user.role);
    }
    async uploadPictures(user, id, files) {
        if (!files.pictures || files.pictures.length === 0)
            throw new common_1.BadRequestException("No pictures uploaded");
        const picturePaths = files.pictures.map((file) => `/pictures/${file.filename}`);
        return this.sitesService.addPictures(id, user.id, user.role, picturePaths);
    }
    async uploadReceipt(user, id, file) {
        if (!file) {
            throw new common_1.BadRequestException("No receipt document file uploaded");
        }
        const receiptPath = `/receipts/${file.filename}`;
        return this.sitesService.setReceiptImage(id, user.id, user.role, receiptPath);
    }
    async uploadVideo(user, id, files) {
        if (!files.video || files.video.length === 0)
            throw new common_1.BadRequestException("No video uploaded");
        const videoPath = `/videos/${files.video[0].filename}`;
        return this.sitesService.setVideo(id, user.id, user.role, videoPath);
    }
    async removePicture(user, id, picturePath) {
        if (!picturePath)
            throw new common_1.BadRequestException("Picture path is required");
        return this.sitesService.removePicture(id, user.id, user.role, picturePath);
    }
    async uploadDocuments(user, id, files) {
        if (!files.documents || files.documents.length === 0) {
            throw new common_1.BadRequestException("No documents uploaded");
        }
        const docsData = files.documents.map((file) => ({
            path: `/documents/${file.filename}`,
            originalName: file.originalname,
        }));
        return this.sitesService.addDocuments(id, user.id, user.role, docsData);
    }
    async removeDocument(user, docId) {
        return this.sitesService.removeDocument(docId, user.id, user.role);
    }
    async getPendingSites(query) {
        return this.sitesService.getPendingSites();
    }
    async getAllSites(query) {
        return this.sitesService.getAllSites(query);
    }
    async getSiteForEdit(id) {
        return this.sitesService.getSiteForEdit(id);
    }
    async verifySite(user, id, dto) {
        return this.sitesService.verifySite(user.id, id, dto);
    }
    async changeStatus(user, id, status, rejectionReason) {
        return this.sitesService.changeStatus(id, {
            userId: user.id,
            userRole: user.role,
            status,
            rejectionReason: rejectionReason || null,
        });
    }
    async toggleFeatured(id) {
        return this.sitesService.toggleFeatured(id);
    }
    async deleteAnySite(id) {
        return this.sitesService.deleteAnySite(id);
    }
    async getStats() {
        return this.sitesService.getStats();
    }
};
exports.SitesController = SitesController;
__decorate([
    (0, common_1.Get)("public"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_site_dto_1.FilterSitesDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "getPublicSites", null);
__decorate([
    (0, common_1.Get)("public/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "getPublicSite", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)("CLIENT", "MODERATOR", "ADMIN"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_site_dto_1.CreateSiteDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "createSite", null);
__decorate([
    (0, common_1.Get)("my"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("CLIENT", "MODERATOR", "ADMIN"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "getMySites", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, subscription_guard_1.SubscriptionGuard),
    (0, roles_decorator_1.Roles)("CLIENT", "MODERATOR", "ADMIN"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_site_dto_1.UpdateSiteDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "updateSite", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("CLIENT", "MODERATOR", "ADMIN"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "deleteSite", null);
__decorate([
    (0, common_1.Post)(":id/pictures"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("CLIENT", "MODERATOR", "ADMIN"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: "pictures", maxCount: 10 }], {
        fileFilter: pictureFilter,
        limits: {
            fileSize: 10 * 1024 * 1024,
            files: 10,
        },
        storage: (0, multer_1.diskStorage)({ ...pictureStorage }),
    })),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "uploadPictures", null);
__decorate([
    (0, common_1.Post)(":id/receipt"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("CLIENT", "MODERATOR", "ADMIN"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("receipt", {
        fileFilter: receiptFilter,
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        storage: (0, multer_1.diskStorage)({ ...receiptStorage }),
    })),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "uploadReceipt", null);
__decorate([
    (0, common_1.Post)(":id/video"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("CLIENT", "MODERATOR", "ADMIN"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: "video", maxCount: 1 }], {
        fileFilter: videoFilter,
        limits: {
            fileSize: 26 * 1024 * 1024,
            files: 1,
        },
        storage: (0, multer_1.diskStorage)({ ...videoStorage }),
    })),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "uploadVideo", null);
__decorate([
    (0, common_1.Delete)(":id/pictures"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("CLIENT", "MODERATOR", "ADMIN"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)("path")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "removePicture", null);
__decorate([
    (0, common_1.Post)(":id/documents"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("CLIENT", "MODERATOR", "ADMIN"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: "documents", maxCount: 5 }], {
        fileFilter: documentFilter,
        limits: { fileSize: 10 * 1024 * 1024 },
        storage: (0, multer_1.diskStorage)({ ...documentStorage }),
    })),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "uploadDocuments", null);
__decorate([
    (0, common_1.Delete)("documents/:docId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("CLIENT", "MODERATOR", "ADMIN"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("docId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "removeDocument", null);
__decorate([
    (0, common_1.Get)("pending"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("MODERATOR", "ADMIN"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "getPendingSites", null);
__decorate([
    (0, common_1.Get)("all"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("MODERATOR", "ADMIN"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "getAllSites", null);
__decorate([
    (0, common_1.Get)("manage/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("MODERATOR", "ADMIN"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "getSiteForEdit", null);
__decorate([
    (0, common_1.Patch)(":id/verify"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("MODERATOR", "ADMIN"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_site_dto_1.VerifySiteDto]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "verifySite", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("MODERATOR", "ADMIN"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)("status")),
    __param(3, (0, common_1.Body)("rejectionReason")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "changeStatus", null);
__decorate([
    (0, common_1.Patch)(":id/featured"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("MODERATOR", "ADMIN"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "toggleFeatured", null);
__decorate([
    (0, common_1.Delete)("admin/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "deleteAnySite", null);
__decorate([
    (0, common_1.Get)("stats/dashboard"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("MODERATOR", "ADMIN"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SitesController.prototype, "getStats", null);
exports.SitesController = SitesController = __decorate([
    (0, common_1.Controller)("sites"),
    __metadata("design:paramtypes", [sites_service_1.SitesService])
], SitesController);
//# sourceMappingURL=sites.controller.js.map