import { CreateSiteDto, FilterSitesDto, UpdateSiteDto, VerifySiteDto } from "./dto/create-site.dto";
import { SitesService } from "./sites.service";
export declare class SitesController {
    private readonly sitesService;
    constructor(sitesService: SitesService);
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
    createSite(user: any, dto: CreateSiteDto): Promise<any>;
    getMySites(user: any): Promise<any[]>;
    updateSite(user: any, id: string, dto: UpdateSiteDto): Promise<{
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
    deleteSite(user: any, id: string): Promise<{
        message: string;
    }>;
    uploadPictures(user: any, id: string, files: {
        pictures?: Express.Multer.File[];
    }): Promise<{
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
    uploadReceipt(user: any, id: string, file: Express.Multer.File): Promise<any>;
    uploadVideo(user: any, id: string, files: {
        video?: Express.Multer.File[];
    }): Promise<{
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
    removePicture(user: any, id: string, picturePath: string): Promise<{
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
    uploadDocuments(user: any, id: string, files: {
        documents?: Express.Multer.File[];
    }): Promise<{
        message: string;
    }>;
    removeDocument(user: any, docId: string): Promise<{
        message: string;
    }>;
    getPendingSites(query: any): Promise<any[]>;
    getAllSites(query: any & {
        status?: string;
    }): Promise<{
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
    getSiteForEdit(id: string): Promise<any>;
    verifySite(user: any, id: string, dto: VerifySiteDto): Promise<{
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
    changeStatus(user: any, id: string, status: "PENDING" | "VERIFIED" | "REJECTED", rejectionReason?: string): Promise<{
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
    toggleFeatured(id: string): Promise<{
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
    deleteAnySite(id: string): Promise<{
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
