import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../common/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CreateSiteDto, FilterSitesDto, UpdateSiteDto, VerifySiteDto } from "./dto/create-site.dto";
export declare class SitesService {
    private prisma;
    private notificationsService;
    private configService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, configService: ConfigService);
    private formatSiteMedia;
    getPublicSites(query: FilterSitesDto): Promise<{
        data: any[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getPublicSite(id: string): Promise<any>;
    createSite(userId: string, dto: CreateSiteDto, userRole: string): Promise<any>;
    getMySites(userId: string): Promise<any[]>;
    updateSite(userId: string, siteId: string, dto: UpdateSiteDto, userRole: string): Promise<{
        pictures: string[];
        kebele: {
            woreda: {
                zone: {
                    id: string;
                    name: string;
                    createdAt: Date;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                zoneId: string;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            woredaId: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SiteStatus;
        title: string;
        description: string;
        areaSize: number | null;
        documents: string;
        receiptImage: string;
        video: string | null;
        googleMapsLink: string | null;
        isPublished: boolean;
        isFeatured: boolean;
        rejectionReason: string | null;
        verifiedAt: Date | null;
        userId: string;
        kebeleId: string;
        siteTypeId: string;
        mineralTypeId: string;
        verifiedBy: string | null;
    }>;
    deleteSite(userId: string, siteId: string, userRole: string): Promise<{
        message: string;
    }>;
    getPendingSites(): Promise<any[]>;
    getAllSites(query: any): Promise<{
        data: {
            pictures: string[];
            kebele: {
                woreda: {
                    zone: {
                        id: string;
                        name: string;
                        createdAt: Date;
                    };
                } & {
                    id: string;
                    name: string;
                    createdAt: Date;
                    zoneId: string;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                woredaId: string;
            };
            owner: {
                id: string;
                email: string;
                fullName: string;
                phone: string | null;
                userType: import(".prisma/client").$Enums.UserType;
            };
            verifier: {
                id: string;
                fullName: string;
            } | null;
            siteDocuments: {
                id: string;
                createdAt: Date;
                siteId: string;
                filePath: string;
                originalName: string;
                fileType: string;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.SiteStatus;
            title: string;
            description: string;
            areaSize: number | null;
            documents: string;
            receiptImage: string;
            video: string | null;
            googleMapsLink: string | null;
            isPublished: boolean;
            isFeatured: boolean;
            rejectionReason: string | null;
            verifiedAt: Date | null;
            userId: string;
            kebeleId: string;
            siteTypeId: string;
            mineralTypeId: string;
            verifiedBy: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    verifySite(moderatorId: string, siteId: string, dto: VerifySiteDto): Promise<{
        pictures: string[];
        kebele: {
            woreda: {
                zone: {
                    id: string;
                    name: string;
                    createdAt: Date;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                zoneId: string;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            woredaId: string;
        };
        owner: {
            id: string;
            email: string;
            fullName: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SiteStatus;
        title: string;
        description: string;
        areaSize: number | null;
        documents: string;
        receiptImage: string;
        video: string | null;
        googleMapsLink: string | null;
        isPublished: boolean;
        isFeatured: boolean;
        rejectionReason: string | null;
        verifiedAt: Date | null;
        userId: string;
        kebeleId: string;
        siteTypeId: string;
        mineralTypeId: string;
        verifiedBy: string | null;
    }>;
    changeStatus(id: string, dto: {
        userId: string;
        userRole: string;
        status?: "PENDING" | "UNVERIFIED" | "VERIFIED" | "REJECTED" | "CLOSED";
        rejectionReason?: string | null;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SiteStatus;
        title: string;
        description: string;
        areaSize: number | null;
        pictures: string;
        documents: string;
        receiptImage: string;
        video: string | null;
        googleMapsLink: string | null;
        isPublished: boolean;
        isFeatured: boolean;
        rejectionReason: string | null;
        verifiedAt: Date | null;
        userId: string;
        kebeleId: string;
        siteTypeId: string;
        mineralTypeId: string;
        verifiedBy: string | null;
    }>;
    toggleFeatured(siteId: string): Promise<{
        pictures: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SiteStatus;
        title: string;
        description: string;
        areaSize: number | null;
        documents: string;
        receiptImage: string;
        video: string | null;
        googleMapsLink: string | null;
        isPublished: boolean;
        isFeatured: boolean;
        rejectionReason: string | null;
        verifiedAt: Date | null;
        userId: string;
        kebeleId: string;
        siteTypeId: string;
        mineralTypeId: string;
        verifiedBy: string | null;
    }>;
    deleteAnySite(siteId: string): Promise<{
        message: string;
    }>;
    getSiteForEdit(siteId: string): Promise<any>;
    addPictures(siteId: string, userId: string, userRole: string, picturePaths: string[]): Promise<{
        pictures: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SiteStatus;
        title: string;
        description: string;
        areaSize: number | null;
        documents: string;
        receiptImage: string;
        video: string | null;
        googleMapsLink: string | null;
        isPublished: boolean;
        isFeatured: boolean;
        rejectionReason: string | null;
        verifiedAt: Date | null;
        userId: string;
        kebeleId: string;
        siteTypeId: string;
        mineralTypeId: string;
        verifiedBy: string | null;
    }>;
    setReceiptImage(id: string, userId: string, userRole: string, receiptPath: string): Promise<any>;
    removePicture(siteId: string, userId: string, userRole: string, picturePath: string): Promise<{
        pictures: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SiteStatus;
        title: string;
        description: string;
        areaSize: number | null;
        documents: string;
        receiptImage: string;
        video: string | null;
        googleMapsLink: string | null;
        isPublished: boolean;
        isFeatured: boolean;
        rejectionReason: string | null;
        verifiedAt: Date | null;
        userId: string;
        kebeleId: string;
        siteTypeId: string;
        mineralTypeId: string;
        verifiedBy: string | null;
    }>;
    setVideo(siteId: string, userId: string, userRole: string, videoPath: string): Promise<{
        pictures: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SiteStatus;
        title: string;
        description: string;
        areaSize: number | null;
        documents: string;
        receiptImage: string;
        video: string | null;
        googleMapsLink: string | null;
        isPublished: boolean;
        isFeatured: boolean;
        rejectionReason: string | null;
        verifiedAt: Date | null;
        userId: string;
        kebeleId: string;
        siteTypeId: string;
        mineralTypeId: string;
        verifiedBy: string | null;
    }>;
    addDocuments(siteId: string, userId: string, userRole: string, docsData: {
        path: string;
        originalName: string;
    }[]): Promise<{
        message: string;
    }>;
    removeDocument(docId: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        sites: {
            total: number;
            pending: number;
            verified: number;
            rejected: number;
            featured: number;
        };
        users: number;
        subscribers: number;
    }>;
}
