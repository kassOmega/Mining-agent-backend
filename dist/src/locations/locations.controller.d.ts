import { LocationsService } from "./locations.service";
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    getZones(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }[]>;
    getWoredas(zoneId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        zoneId: string;
    }[]>;
    getKebeles(woredaId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        woredaId: string;
    }[]>;
    createZone(body: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }>;
    updateZone(id: string, body: {
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
    createWoreda(body: {
        name: string;
        zoneId: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        zoneId: string;
    }>;
    updateWoreda(id: string, body: {
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
    createKebele(body: {
        name: string;
        woredaId: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        woredaId: string;
    }>;
    updateKebele(id: string, body: {
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
