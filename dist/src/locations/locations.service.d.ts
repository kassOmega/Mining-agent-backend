import { PrismaService } from "../common/prisma.service";
export declare class LocationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getZones(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }[]>;
    getWoredasByZone(zoneId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        zoneId: string;
    }[]>;
    getKebelesByWoreda(woredaId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        woredaId: string;
    }[]>;
    getLocationChain(kebeleId: string): Promise<{
        zone: {
            id: string;
            name: string;
            createdAt: Date;
        };
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
    } | null>;
    createZone(data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }>;
    updateZone(id: string, data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }>;
    deleteZone(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }>;
    createWoreda(data: {
        name: string;
        zoneId: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        zoneId: string;
    }>;
    updateWoreda(id: string, data: {
        name: string;
        zoneId?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        zoneId: string;
    }>;
    deleteWoreda(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        zoneId: string;
    }>;
    createKebele(data: {
        name: string;
        woredaId: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        woredaId: string;
    }>;
    updateKebele(id: string, data: {
        name: string;
        woredaId?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        woredaId: string;
    }>;
    deleteKebele(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        woredaId: string;
    }>;
}
