import { CreateMetadataDto } from "./dto/create-metadata.dto";
import { UpdateMetadataDto } from "./dto/update-metadata.dto";
import { MetadataService } from "./metadata.service";
export declare class MetadataController {
    private readonly metadataService;
    constructor(metadataService: MetadataService);
    getSiteTypes(): Promise<{
        id: string;
        name: string;
        label: string;
        createdAt: Date;
    }[]>;
    getMineralTypes(): Promise<{
        id: string;
        name: string;
        label: string;
        createdAt: Date;
    }[]>;
    createSiteType(dto: CreateMetadataDto): Promise<{
        id: string;
        name: string;
        label: string;
        createdAt: Date;
    }>;
    createMineralType(dto: CreateMetadataDto): Promise<{
        id: string;
        name: string;
        label: string;
        createdAt: Date;
    }>;
    updateSiteType(id: string, dto: UpdateMetadataDto): Promise<{
        id: string;
        name: string;
        label: string;
        createdAt: Date;
    }>;
    deleteSiteType(id: string): Promise<{
        id: string;
        name: string;
        label: string;
        createdAt: Date;
    }>;
    updateMineralType(id: string, dto: UpdateMetadataDto): Promise<{
        id: string;
        name: string;
        label: string;
        createdAt: Date;
    }>;
    deleteMineralType(id: string): Promise<{
        id: string;
        name: string;
        label: string;
        createdAt: Date;
    }>;
}
