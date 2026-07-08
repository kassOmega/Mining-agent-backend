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
exports.SitesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../common/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let SitesService = class SitesService {
    constructor(prisma, notificationsService, configService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.configService = configService;
    }
    formatSiteMedia(site) {
        if (!site)
            return null;
        let baseUrl = this.configService.get("BACKEND_URL") ||
            "http://localhost:3001/api";
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.slice(0, -1);
        }
        const safeParseArray = (data) => {
            if (!data)
                return [];
            if (typeof data !== "string")
                return Array.isArray(data) ? data : [];
            try {
                return JSON.parse(data);
            }
            catch {
                return [];
            }
        };
        const pictures = safeParseArray(site.pictures).map((path) => {
            if (!path)
                return "";
            return path.startsWith("http")
                ? path
                : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
        });
        let video = site.video ? site.video : null;
        if (video && !video.startsWith("http")) {
            video = `${baseUrl}${video.startsWith("/") ? "" : "/"}${video}`;
        }
        const rawDocuments = site.siteDocuments || [];
        const documents = rawDocuments.map((doc) => {
            if (!doc || !doc.filePath)
                return doc;
            const fullPath = doc.filePath.startsWith("http")
                ? doc.filePath
                : `${baseUrl}${doc.filePath.startsWith("/") ? "" : "/"}${doc.filePath}`;
            return { ...doc, filePath: fullPath };
        });
        let receiptImage = site.receiptImage ? site.receiptImage : null;
        if (receiptImage && !receiptImage.startsWith("http")) {
            receiptImage = `${baseUrl}${receiptImage.startsWith("/") ? "" : "/"}${receiptImage}`;
        }
        return {
            ...site,
            pictures,
            video,
            documents,
            receiptImage,
        };
    }
    async getPublicSites(query) {
        const page = parseInt(query.page || "1", 10);
        const limit = parseInt(query.limit || "12", 10);
        const skip = (page - 1) * limit;
        const where = {
            isPublished: true,
            status: {
                in: ["VERIFIED", "UNVERIFIED"],
            },
        };
        if (query.kebeleId) {
            where.kebeleId = query.kebeleId;
        }
        else if (query.woredaId) {
            where.kebele = { woredaId: query.woredaId };
        }
        else if (query.zoneId) {
            where.kebele = { woreda: { zoneId: query.zoneId } };
        }
        if (query.siteTypeId) {
            where.siteTypeId = query.siteTypeId;
        }
        if (query.mineralTypeId) {
            where.mineralTypeId = query.mineralTypeId;
        }
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: "insensitive" } },
                { description: { contains: query.search, mode: "insensitive" } },
            ];
        }
        let orderBy = { createdAt: "desc" };
        if (query.sort === "oldest") {
            orderBy = { createdAt: "asc" };
        }
        else if (query.sort === "featured") {
            orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];
        }
        const [sites, total] = await Promise.all([
            this.prisma.site.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    owner: {
                        select: {
                            id: true,
                            fullName: true,
                            phone: true,
                            userType: true,
                        },
                    },
                    kebele: { include: { woreda: { include: { zone: true } } } },
                    siteType: true,
                    mineralType: true,
                },
            }),
            this.prisma.site.count({ where }),
        ]);
        return {
            data: sites.map((site) => {
                const formattedSite = this.formatSiteMedia(site);
                return {
                    ...formattedSite,
                    owner: site.owner
                        ? {
                            fullName: site.owner.fullName,
                            phone: site.owner.userType === "BROKER" && site.status === "VERIFIED"
                                ? site.owner.phone
                                : null,
                            userType: site.owner.userType,
                        }
                        : null,
                };
            }),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getPublicSite(id) {
        const site = await this.prisma.site.findFirst({
            where: {
                id,
                status: {
                    in: ["VERIFIED", "UNVERIFIED"],
                },
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        phone: true,
                        userType: true,
                        email: true,
                    },
                },
                kebele: { include: { woreda: { include: { zone: true } } } },
            },
        });
        if (!site)
            throw new common_1.NotFoundException("Site not found");
        const formattedSite = this.formatSiteMedia(site);
        return {
            ...formattedSite,
            owner: site.owner
                ? {
                    fullName: site.owner.fullName,
                    phone: site.owner.phone,
                    userType: site.owner.userType,
                    email: site.owner.email,
                }
                : null,
        };
    }
    async createSite(userId, dto, userRole) {
        const kebele = await this.prisma.kebele.findUnique({
            where: { id: dto.kebeleId },
        });
        if (!kebele)
            throw new common_1.BadRequestException("Invalid kebele selected");
        const [siteTypeExists, mineralTypeExists] = await Promise.all([
            this.prisma.siteType.findUnique({ where: { id: dto.siteTypeId } }),
            this.prisma.mineralType.findUnique({ where: { id: dto.mineralTypeId } }),
        ]);
        if (!siteTypeExists || !mineralTypeExists)
            throw new common_1.BadRequestException("Invalid configuration metadata parameters");
        let requiresReceiptApproval = false;
        if (userRole === "CLIENT") {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { subscription: true },
            });
        }
        const site = await this.prisma.site.create({
            data: {
                userId,
                kebeleId: dto.kebeleId,
                title: dto.title,
                description: dto.description,
                siteTypeId: dto.siteTypeId,
                mineralTypeId: dto.mineralTypeId,
                areaSize: dto.areaSize,
                pictures: JSON.stringify([]),
                documents: JSON.stringify([]),
                googleMapsLink: dto.googleMapsLink,
                status: "PENDING",
                isPublished: !requiresReceiptApproval,
                receiptImage: dto.receiptImage,
            },
            include: {
                kebele: { include: { woreda: { include: { zone: true } } } },
                siteType: true,
                mineralType: true,
            },
        });
        return this.formatSiteMedia(site);
    }
    async getMySites(userId) {
        const sites = await this.prisma.site.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                kebele: { include: { woreda: { include: { zone: true } } } },
                verifier: { select: { id: true, fullName: true } },
                siteType: true,
                mineralType: true,
            },
        });
        return sites.map((site) => this.formatSiteMedia(site));
    }
    async updateSite(userId, siteId, dto, userRole) {
        const site = await this.prisma.site.findUnique({ where: { id: siteId } });
        if (!site)
            throw new common_1.NotFoundException("Site not found");
        if (site.userId !== userId &&
            userRole !== "MODERATOR" &&
            userRole !== "ADMIN") {
            throw new common_1.ForbiddenException("You can only update your own sites");
        }
        const updateData = { ...dto };
        if (userRole === "CLIENT") {
            updateData.status = "PENDING";
            updateData.verifiedAt = null;
            updateData.verifiedBy = null;
            updateData.rejectionReason = null;
        }
        const updated = await this.prisma.site.update({
            where: { id: siteId },
            data: updateData,
            include: { kebele: { include: { woreda: { include: { zone: true } } } } },
        });
        if (userRole === "CLIENT") {
            await this.notificationsService.notifyModeratorsNewPost(updated);
        }
        return { ...updated, pictures: JSON.parse(updated.pictures) };
    }
    async deleteSite(userId, siteId, userRole) {
        const site = await this.prisma.site.findUnique({ where: { id: siteId } });
        if (!site)
            throw new common_1.NotFoundException("Site not found");
        if (site.userId !== userId &&
            userRole !== "MODERATOR" &&
            userRole !== "ADMIN") {
            throw new common_1.ForbiddenException("You can only delete your own sites");
        }
        await this.prisma.site.delete({ where: { id: siteId } });
        return { message: "Site deleted successfully" };
    }
    async getPendingSites() {
        const sites = await this.prisma.site.findMany({
            where: { status: "PENDING" },
            orderBy: { createdAt: "asc" },
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        phone: true,
                        email: true,
                        userType: true,
                    },
                },
                kebele: { include: { woreda: { include: { zone: true } } } },
                siteDocuments: true,
            },
        });
        return sites.map((site) => this.formatSiteMedia(site));
    }
    async getAllSites(query) {
        const page = parseInt(query.page || "1", 10);
        const limit = parseInt(query.limit || "20", 10);
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.kebeleId)
            where.kebeleId = query.kebeleId;
        else if (query.woredaId)
            where.kebele = { woredaId: query.woredaId };
        else if (query.zoneId)
            where.kebele = { woreda: { zoneId: query.zoneId } };
        if (query.siteType)
            where.siteType = query.siteType;
        if (query.mineralType)
            where.mineralType = query.mineralType;
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: "insensitive" } },
                { description: { contains: query.search, mode: "insensitive" } },
                {
                    owner: { fullName: { contains: query.search, mode: "insensitive" } },
                },
            ];
        }
        const [sites, total] = await Promise.all([
            this.prisma.site.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    owner: {
                        select: {
                            id: true,
                            fullName: true,
                            phone: true,
                            email: true,
                            userType: true,
                        },
                    },
                    kebele: { include: { woreda: { include: { zone: true } } } },
                    verifier: { select: { id: true, fullName: true } },
                    siteDocuments: true,
                },
            }),
            this.prisma.site.count({ where }),
        ]);
        return {
            data: sites.map((site) => ({
                ...site,
                pictures: JSON.parse(site.pictures),
            })),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async verifySite(moderatorId, siteId, dto) {
        const site = await this.prisma.site.findFirst({
            where: { id: siteId },
            include: {
                owner: true,
                kebele: { include: { woreda: { include: { zone: true } } } },
            },
        });
        if (!site)
            throw new common_1.NotFoundException("Site not found");
        if (site.status !== "PENDING")
            throw new common_1.BadRequestException("Site is not in pending status");
        const updated = await this.prisma.site.update({
            where: { id: siteId },
            data: {
                status: dto.status,
                verifiedBy: moderatorId,
                verifiedAt: dto.status === "VERIFIED" ? new Date() : null,
                rejectionReason: dto.status === "REJECTED" ? dto.rejectionReason : null,
            },
            include: {
                owner: { select: { id: true, fullName: true, email: true } },
                kebele: { include: { woreda: { include: { zone: true } } } },
            },
        });
        if (dto.status === "VERIFIED") {
            await this.notificationsService.notifySiteVerified(site.owner.email, site.title);
            await this.notificationsService.notifySubscribersNewSite(updated);
        }
        else {
            await this.notificationsService.notifySiteRejected(site.owner.email, site.title, dto.rejectionReason || "Not specified");
        }
        return { ...updated, pictures: JSON.parse(updated.pictures) };
    }
    async changeStatus(id, dto) {
        const currentSite = await this.prisma.site.findUnique({ where: { id } });
        if (!currentSite)
            throw new common_1.NotFoundException("Site listing not found");
        if (dto.userRole !== "ADMIN" && dto.userRole !== "MODERATOR") {
            throw new common_1.ForbiddenException("You do not have administrative permissions to update listing status");
        }
        const updateData = {};
        if (dto.status) {
            updateData.status = dto.status;
            if (dto.status === "VERIFIED" || dto.status === "UNVERIFIED") {
                updateData.isPublished = true;
                if (dto.status === "VERIFIED") {
                    updateData.rejectionReason = null;
                }
            }
            else {
                updateData.isPublished = false;
            }
        }
        if (dto.rejectionReason !== undefined) {
            updateData.rejectionReason = dto.rejectionReason;
        }
        return this.prisma.site.update({
            where: { id },
            data: updateData,
        });
    }
    async toggleFeatured(siteId) {
        const site = await this.prisma.site.findUnique({ where: { id: siteId } });
        if (!site)
            throw new common_1.NotFoundException("Site not found");
        const updated = await this.prisma.site.update({
            where: { id: siteId },
            data: { isFeatured: !site.isFeatured },
        });
        return { ...updated, pictures: JSON.parse(updated.pictures) };
    }
    async deleteAnySite(siteId) {
        const site = await this.prisma.site.findUnique({ where: { id: siteId } });
        if (!site)
            throw new common_1.NotFoundException("Site not found");
        await this.prisma.site.delete({ where: { id: siteId } });
        return { message: "Site deleted successfully" };
    }
    async getSiteForEdit(siteId) {
        const site = await this.prisma.site.findFirst({
            where: { id: siteId },
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        phone: true,
                        email: true,
                        userType: true,
                    },
                },
                kebele: { include: { woreda: { include: { zone: true } } } },
                siteDocuments: true,
                siteType: true,
                mineralType: true,
            },
        });
        if (!site)
            throw new common_1.NotFoundException("Site not found");
        return this.formatSiteMedia(site);
    }
    async addPictures(siteId, userId, userRole, picturePaths) {
        const site = await this.prisma.site.findUnique({ where: { id: siteId } });
        if (!site)
            throw new common_1.NotFoundException("Site not found");
        if (site.userId !== userId &&
            userRole !== "MODERATOR" &&
            userRole !== "ADMIN") {
            throw new common_1.ForbiddenException("You can only add pictures to sites you manage");
        }
        const existingPictures = JSON.parse(site.pictures);
        const allPictures = [...existingPictures, ...picturePaths];
        const updated = await this.prisma.site.update({
            where: { id: siteId },
            data: { pictures: JSON.stringify(allPictures) },
        });
        return { ...updated, pictures: JSON.parse(updated.pictures) };
    }
    async setReceiptImage(id, userId, userRole, receiptPath) {
        const currentSite = await this.prisma.site.findUnique({ where: { id } });
        if (!currentSite)
            throw new common_1.NotFoundException("Mining site concession listing record not found");
        if (currentSite.userId !== userId &&
            userRole !== "MODERATOR" &&
            userRole !== "ADMIN") {
            throw new common_1.ForbiddenException("You do not possess administrative permissions to bind tracking media to this asset entry");
        }
        const updated = await this.prisma.site.update({
            where: { id },
            data: {
                receiptImage: receiptPath,
            },
            include: {
                kebele: { include: { woreda: { include: { zone: true } } } },
                siteType: true,
                mineralType: true,
                siteDocuments: true,
            },
        });
        return this.formatSiteMedia(updated);
    }
    async removePicture(siteId, userId, userRole, picturePath) {
        const site = await this.prisma.site.findUnique({ where: { id: siteId } });
        if (!site)
            throw new common_1.NotFoundException("Site not found");
        if (site.userId !== userId &&
            userRole !== "MODERATOR" &&
            userRole !== "ADMIN") {
            throw new common_1.ForbiddenException("You can only remove pictures from sites you manage");
        }
        const existingPictures = JSON.parse(site.pictures);
        const filteredPictures = existingPictures.filter((p) => p !== picturePath);
        const updated = await this.prisma.site.update({
            where: { id: siteId },
            data: { pictures: JSON.stringify(filteredPictures) },
        });
        return { ...updated, pictures: JSON.parse(updated.pictures) };
    }
    async setVideo(siteId, userId, userRole, videoPath) {
        const site = await this.prisma.site.findUnique({ where: { id: siteId } });
        if (!site)
            throw new common_1.NotFoundException("Site not found");
        if (site.userId !== userId &&
            userRole !== "MODERATOR" &&
            userRole !== "ADMIN") {
            throw new common_1.ForbiddenException("You can only set video for your own sites");
        }
        const updated = await this.prisma.site.update({
            where: { id: siteId },
            data: { video: videoPath },
        });
        return { ...updated, pictures: JSON.parse(updated.pictures) };
    }
    async addDocuments(siteId, userId, userRole, docsData) {
        const site = await this.prisma.site.findUnique({ where: { id: siteId } });
        if (!site)
            throw new common_1.NotFoundException("Site not found");
        if (site.userId !== userId &&
            userRole !== "MODERATOR" &&
            userRole !== "ADMIN") {
            throw new common_1.ForbiddenException("You can only add documents to sites you manage");
        }
        await this.prisma.siteDocument.createMany({
            data: docsData.map((doc) => ({
                siteId,
                filePath: doc.path,
                originalName: doc.originalName,
                fileType: "LEGAL",
            })),
        });
        return { message: `${docsData.length} documents uploaded successfully` };
    }
    async removeDocument(docId, userId, userRole) {
        const doc = await this.prisma.siteDocument.findUnique({
            where: { id: docId },
            include: { site: true },
        });
        if (!doc)
            throw new common_1.NotFoundException("Document not found");
        if (doc.site.userId !== userId &&
            userRole !== "MODERATOR" &&
            userRole !== "ADMIN") {
            throw new common_1.ForbiddenException("You can only remove documents from sites you manage");
        }
        await this.prisma.siteDocument.delete({ where: { id: docId } });
        return { message: "Document deleted successfully" };
    }
    async getStats() {
        const [total, pending, verified, rejected, featured] = await Promise.all([
            this.prisma.site.count(),
            this.prisma.site.count({ where: { status: "PENDING" } }),
            this.prisma.site.count({ where: { status: "VERIFIED" } }),
            this.prisma.site.count({ where: { status: "REJECTED" } }),
            this.prisma.site.count({ where: { isFeatured: true } }),
        ]);
        const users = await this.prisma.user.count();
        const subscribers = await this.prisma.subscription.count({
            where: { plan: { not: "FREE" }, status: "ACTIVE" },
        });
        return {
            sites: { total, pending, verified, rejected, featured },
            users,
            subscribers,
        };
    }
};
exports.SitesService = SitesService;
exports.SitesService = SitesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        config_1.ConfigService])
], SitesService);
//# sourceMappingURL=sites.service.js.map