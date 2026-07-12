// backend/src/sites/sites.service.ts

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../common/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import {
  CreateSiteDto,
  FilterSitesDto,
  UpdateSiteDto,
  VerifySiteDto,
} from "./dto/create-site.dto";

@Injectable()
export class SitesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private configService: ConfigService,
  ) {}

  private formatSiteMedia(site: any): any {
    if (!site) return null;

    let baseUrl =
      this.configService.get<string>("BACKEND_URL") ||
      "http://localhost:3001/api";
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    const safeParseArray = (data: any): any[] => {
      if (!data) return [];
      if (typeof data !== "string") return Array.isArray(data) ? data : [];
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    };

    // 1. Pictures Matrix Array Map
    const pictures = safeParseArray(site.pictures).map((path) => {
      if (!path) return "";
      return path.startsWith("http")
        ? path
        : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    });

    // 2. Video Path String
    let video = site.video ? site.video : null;
    if (video && !video.startsWith("http")) {
      video = `${baseUrl}${video.startsWith("/") ? "" : "/"}${video}`;
    }

    // 3. Documents Relational Schema Map
    const rawDocuments = site.siteDocuments || [];
    const documents = rawDocuments.map((doc: any) => {
      if (!doc || !doc.filePath) return doc;
      const fullPath = doc.filePath.startsWith("http")
        ? doc.filePath
        : `${baseUrl}${doc.filePath.startsWith("/") ? "" : "/"}${doc.filePath}`;
      return { ...doc, filePath: fullPath };
    });

    // 4. ✅ Corrected Single String Receipt Handler Check
    let receiptImage = site.receiptImage ? site.receiptImage : null;
    if (receiptImage && !receiptImage.startsWith("http")) {
      receiptImage = `${baseUrl}${receiptImage.startsWith("/") ? "" : "/"}${receiptImage}`;
    }

    return {
      ...site,
      pictures,
      video,
      documents,
      receiptImage, // Now correctly returns an absolute URL string instead of an empty array
    };
  }

  // ==========================================
  // PUBLIC: Get verified sites (With Pagination & Filters)
  // ==========================================
  async getPublicSites(query: FilterSitesDto) {
    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit || "12", 10);
    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true,
      status: {
        in: ["VERIFIED", "UNVERIFIED"],
      },
    };
    // 1. Geographic Hierarchy Matching Bounds
    if (query.kebeleId) {
      where.kebeleId = query.kebeleId;
    } else if (query.woredaId) {
      where.kebele = { woredaId: query.woredaId };
    } else if (query.zoneId) {
      where.kebele = { woreda: { zoneId: query.zoneId } };
    }

    // 2. Updated to match your relational DTO property keys ✅
    if (query.siteTypeId) {
      where.siteTypeId = query.siteTypeId;
    }
    if (query.mineralTypeId) {
      where.mineralTypeId = query.mineralTypeId;
    }

    // 3. Insensitive search block conditions
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (query.sort === "oldest") {
      orderBy = { createdAt: "asc" };
    } else if (query.sort === "featured") {
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
          siteType: true, // ✅ Include the dynamic relational entity details
          mineralType: true, // ✅ Include the dynamic relational entity details
        },
      }),
      this.prisma.site.count({ where }),
    ]);

    return {
      data: sites.map((site) => {
        // Format picture arrays and video strings cleanly
        const formattedSite = this.formatSiteMedia(site);

        return {
          ...formattedSite,
          owner: site.owner
            ? {
                fullName: site.owner.fullName,
                phone:
                  site.owner.userType === "BROKER" && site.status === "VERIFIED"
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
  // ==========================================
  // PUBLIC: Get single site
  // ==========================================
  async getPublicSite(id: string) {
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
            role: true,
          },
        },
        kebele: { include: { woreda: { include: { zone: true } } } },
      },
    });

    if (!site) throw new NotFoundException("Site not found");

    const formattedSite = this.formatSiteMedia(site);

    return {
      ...formattedSite,
      owner: site.owner
        ? {
            fullName: site.owner.fullName,
            phone: site.owner.phone,
            userType: site.owner.userType,
            email: site.owner.email,
            role: site.owner.role,
          }
        : null,
    };
  }

  // ==========================================
  // CLIENT: Create site
  // ==========================================

  async createSite(userId: string, dto: CreateSiteDto, userRole: string) {
    const kebele = await this.prisma.kebele.findUnique({
      where: { id: dto.kebeleId },
    });
    if (!kebele) throw new BadRequestException("Invalid kebele selected");

    const [siteTypeExists, mineralTypeExists] = await Promise.all([
      this.prisma.siteType.findUnique({ where: { id: dto.siteTypeId } }),
      this.prisma.mineralType.findUnique({ where: { id: dto.mineralTypeId } }),
    ]);
    if (!siteTypeExists || !mineralTypeExists)
      throw new BadRequestException(
        "Invalid configuration metadata parameters",
      );

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

        // ✅ Status Implementation Matrix logic
        status: "PENDING",
        isPublished: !requiresReceiptApproval, // Pre-publish only if they are premium, otherwise hold for staff receipt audit
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
  // ==========================================
  // CLIENT: Get own sites
  // ==========================================
  async getMySites(userId: string) {
    const sites = await this.prisma.site.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        kebele: { include: { woreda: { include: { zone: true } } } },
        verifier: { select: { id: true, fullName: true } },
        siteType: true, // ✅ Included relation to prevent frontend errors
        mineralType: true, // ✅ Included relation to prevent frontend errors
      },
    });

    // ✅ Maps over the entries to inject the complete baseUrl for pictures, video, and documents
    return sites.map((site) => this.formatSiteMedia(site));
  }

  // ==========================================
  // CLIENT: Update own site
  // ==========================================
  async updateSite(
    userId: string,
    siteId: string,
    dto: UpdateSiteDto,
    userRole: string,
  ) {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });
    if (!site) throw new NotFoundException("Site not found");

    if (
      site.userId !== userId &&
      userRole !== "MODERATOR" &&
      userRole !== "ADMIN"
    ) {
      throw new ForbiddenException("You can only update your own sites");
    }

    const updateData: any = { ...dto };
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

    return { ...updated, pictures: JSON.parse(updated.pictures) as string[] };
  }

  // ==========================================
  // CLIENT: Delete own site
  // ==========================================
  async deleteSite(userId: string, siteId: string, userRole: string) {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });
    if (!site) throw new NotFoundException("Site not found");
    if (
      site.userId !== userId &&
      userRole !== "MODERATOR" &&
      userRole !== "ADMIN"
    ) {
      throw new ForbiddenException("You can only delete your own sites");
    }
    await this.prisma.site.delete({ where: { id: siteId } });
    return { message: "Site deleted successfully" };
  }
  // ==========================================
  // MODERATOR/ADMIN: Get all pending sites
  // ==========================================
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

    // Maps over every pending site and applies the .env BACKEND_URL formatting logic
    return sites.map((site) => this.formatSiteMedia(site));
  }

  // ==========================================
  // MODERATOR/ADMIN: Get all sites (with filters)
  // ==========================================
  async getAllSites(query: any) {
    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit || "20", 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.kebeleId) where.kebeleId = query.kebeleId;
    else if (query.woredaId) where.kebele = { woredaId: query.woredaId };
    else if (query.zoneId) where.kebele = { woreda: { zoneId: query.zoneId } };
    if (query.siteType) where.siteType = query.siteType;
    if (query.mineralType) where.mineralType = query.mineralType;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        {
          owner: { fullName: { contains: query.search, mode: "insensitive" } },
        }, // FIX: 'owner'
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
          }, // FIX: 'owner'
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
        pictures: JSON.parse(site.pictures) as string[],
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ==========================================
  // MODERATOR/ADMIN: Verify or reject site
  // ==========================================
  async verifySite(moderatorId: string, siteId: string, dto: VerifySiteDto) {
    const site = await this.prisma.site.findFirst({
      where: { id: siteId },
      include: {
        owner: true, // FIX: 'owner'
        kebele: { include: { woreda: { include: { zone: true } } } },
      },
    });
    if (!site) throw new NotFoundException("Site not found");
    if (site.status !== "PENDING")
      throw new BadRequestException("Site is not in pending status");

    const updated = await this.prisma.site.update({
      where: { id: siteId },
      data: {
        status: dto.status,
        verifiedBy: moderatorId,
        verifiedAt: dto.status === "VERIFIED" ? new Date() : null,
        rejectionReason: dto.status === "REJECTED" ? dto.rejectionReason : null,
      },
      include: {
        owner: { select: { id: true, fullName: true, email: true } }, // FIX: 'owner'
        kebele: { include: { woreda: { include: { zone: true } } } },
      },
    });

    if (dto.status === "VERIFIED") {
      await this.notificationsService.notifySiteVerified(
        site.owner.email,
        site.title,
      );
      await this.notificationsService.notifySubscribersNewSite(updated);
    } else {
      await this.notificationsService.notifySiteRejected(
        site.owner.email,
        site.title,
        dto.rejectionReason || "Not specified",
      );
    }

    return { ...updated, pictures: JSON.parse(updated.pictures) as string[] };
  }

  // ==========================================
  // MODERATOR/ADMIN: Change site status freely
  // ==========================================

  async changeStatus(
    id: string,
    dto: {
      userId: string;
      userRole: string; // 👈 Add the user's role here
      status?: "PENDING" | "UNVERIFIED" | "VERIFIED" | "REJECTED" | "CLOSED";
      rejectionReason?: string | null;
    },
  ) {
    const currentSite = await this.prisma.site.findUnique({ where: { id } });
    if (!currentSite) throw new NotFoundException("Site listing not found");

    // 🛡️ Admin/Moderator Guard Rule:
    // Only users with administrative privileges are allowed to alter workflow status flags
    if (dto.userRole !== "ADMIN" && dto.userRole !== "MODERATOR") {
      throw new ForbiddenException(
        "You do not have administrative permissions to update listing status",
      );
    }

    const updateData: any = {};

    if (dto.status) {
      updateData.status = dto.status;

      if (dto.status === "VERIFIED" || dto.status === "UNVERIFIED") {
        updateData.isPublished = true; // Automatically push live
        if (dto.status === "VERIFIED") {
          updateData.rejectionReason = null; // Clear out past rejection histories
        }
      } else {
        updateData.isPublished = false; // Hide completely if pending, rejected, or closed
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
  // ==========================================
  // MODERATOR/ADMIN: Toggle featured
  // ==========================================
  async toggleFeatured(siteId: string) {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });
    if (!site) throw new NotFoundException("Site not found");
    const updated = await this.prisma.site.update({
      where: { id: siteId },
      data: { isFeatured: !site.isFeatured },
    });
    return { ...updated, pictures: JSON.parse(updated.pictures) as string[] };
  }

  // ==========================================
  // MODERATOR/ADMIN: Delete any site
  // ==========================================
  async deleteAnySite(siteId: string) {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });
    if (!site) throw new NotFoundException("Site not found");
    await this.prisma.site.delete({ where: { id: siteId } });
    return { message: "Site deleted successfully" };
  }

  // ==========================================
  // MODERATOR/ADMIN: Get single site for editing
  // ==========================================
  async getSiteForEdit(siteId: string) {
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
        }, // FIX: 'owner'
        kebele: { include: { woreda: { include: { zone: true } } } },
        siteDocuments: true,
        siteType: true,
        mineralType: true,
      },
    });

    if (!site) throw new NotFoundException("Site not found");
    return this.formatSiteMedia(site);
  }

  // ==========================================
  // MEDIA: Add pictures to site
  // ==========================================
  async addPictures(
    siteId: string,
    userId: string,
    userRole: string,
    picturePaths: string[],
  ) {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });
    if (!site) throw new NotFoundException("Site not found");
    if (
      site.userId !== userId &&
      userRole !== "MODERATOR" &&
      userRole !== "ADMIN"
    ) {
      throw new ForbiddenException(
        "You can only add pictures to sites you manage",
      );
    }

    const existingPictures: string[] = JSON.parse(site.pictures);
    const allPictures = [...existingPictures, ...picturePaths];

    const updated = await this.prisma.site.update({
      where: { id: siteId },
      data: { pictures: JSON.stringify(allPictures) },
    });
    return { ...updated, pictures: JSON.parse(updated.pictures) as string[] };
  }

  // backend/src/sites/sites.service.ts

  async setReceiptImage(
    id: string,
    userId: string,
    userRole: string,
    receiptPath: string,
  ) {
    const currentSite = await this.prisma.site.findUnique({ where: { id } });
    if (!currentSite)
      throw new NotFoundException(
        "Mining site concession listing record not found",
      );

    // Multi-tenant authorization guard block check
    if (
      currentSite.userId !== userId &&
      userRole !== "MODERATOR" &&
      userRole !== "ADMIN"
    ) {
      throw new ForbiddenException(
        "You do not possess administrative permissions to bind tracking media to this asset entry",
      );
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

  // ==========================================
  // MEDIA: Remove picture from site
  // ==========================================
  async removePicture(
    siteId: string,
    userId: string,
    userRole: string,
    picturePath: string,
  ) {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });
    if (!site) throw new NotFoundException("Site not found");
    if (
      site.userId !== userId &&
      userRole !== "MODERATOR" &&
      userRole !== "ADMIN"
    ) {
      throw new ForbiddenException(
        "You can only remove pictures from sites you manage",
      );
    }

    const existingPictures: string[] = JSON.parse(site.pictures);
    const filteredPictures = existingPictures.filter((p) => p !== picturePath);

    const updated = await this.prisma.site.update({
      where: { id: siteId },
      data: { pictures: JSON.stringify(filteredPictures) },
    });
    return { ...updated, pictures: JSON.parse(updated.pictures) as string[] };
  }

  // ==========================================
  // MEDIA: Set video for site
  // ==========================================
  async setVideo(
    siteId: string,
    userId: string,
    userRole: string,
    videoPath: string,
  ) {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });
    if (!site) throw new NotFoundException("Site not found");
    if (
      site.userId !== userId &&
      userRole !== "MODERATOR" &&
      userRole !== "ADMIN"
    ) {
      throw new ForbiddenException("You can only set video for your own sites");
    }

    const updated = await this.prisma.site.update({
      where: { id: siteId },
      data: { video: videoPath },
    });
    return { ...updated, pictures: JSON.parse(updated.pictures) as string[] };
  }

  // ==========================================
  // MEDIA: Add legal documents to site
  // ==========================================
  async addDocuments(
    siteId: string,
    userId: string,
    userRole: string,
    docsData: { path: string; originalName: string }[],
  ) {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });
    if (!site) throw new NotFoundException("Site not found");

    if (
      site.userId !== userId &&
      userRole !== "MODERATOR" &&
      userRole !== "ADMIN"
    ) {
      throw new ForbiddenException(
        "You can only add documents to sites you manage",
      );
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

  // ==========================================
  // MEDIA: Remove legal document
  // ==========================================
  async removeDocument(docId: string, userId: string, userRole: string) {
    const doc = await this.prisma.siteDocument.findUnique({
      where: { id: docId },
      include: { site: true },
    });

    if (!doc) throw new NotFoundException("Document not found");

    if (
      doc.site.userId !== userId &&
      userRole !== "MODERATOR" &&
      userRole !== "ADMIN"
    ) {
      throw new ForbiddenException(
        "You can only remove documents from sites you manage",
      );
    }

    await this.prisma.siteDocument.delete({ where: { id: docId } });
    return { message: "Document deleted successfully" };
  }

  // ==========================================
  // STATS: For dashboard
  // ==========================================
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
}
