export declare class CreateSiteDto {
    title: string;
    description: string;
    siteTypeId: string;
    mineralTypeId: string;
    areaSize?: number;
    kebeleId: string;
    googleMapsLink?: string;
    pictures?: string[];
    video?: string;
    documents?: any[];
    receiptImage?: string;
}
export declare class UpdateSiteDto {
    title?: string;
    description?: string;
    siteTypeId?: string;
    mineralTypeId?: string;
    areaSize?: number;
    kebeleId?: string;
    googleMapsLink?: string;
    pictures?: string[];
    video?: string;
    documents?: any[];
}
export declare class VerifySiteDto {
    status: "VERIFIED" | "REJECTED";
    rejectionReason?: string;
}
export declare class FilterSitesDto {
    zoneId?: string;
    woredaId?: string;
    kebeleId?: string;
    siteTypeId?: string;
    mineralTypeId?: string;
    search?: string;
    sort?: string;
    page?: string;
    limit?: string;
    postedBy?: "CLIENT" | "STAFF";
}
export declare class UpdateStatusDto {
    verificationStatus?: "UNVERIFIED" | "VERIFIED" | "REJECTED";
    isPublished?: boolean;
    rejectionReason?: string;
}
