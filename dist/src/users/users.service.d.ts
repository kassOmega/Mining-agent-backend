import { UserRole } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: {
        page?: number;
        limit?: number;
        role?: UserRole;
        search?: string;
    }): Promise<{
        data: {
            id: string;
            createdAt: Date;
            email: string;
            fullName: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            subscription: {
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                status: import(".prisma/client").$Enums.SubscriptionStatus;
                endDate: Date;
            } | null;
            _count: {
                ownedSites: number;
            };
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateRole(userId: string, role: UserRole): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    toggleStatus(userId: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        isActive: boolean;
    }>;
    delete(userId: string): Promise<{
        message: string;
    }>;
    updateUser(userId: string, dto: {
        fullName?: string;
        phone?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        fullName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        userType: import(".prisma/client").$Enums.UserType;
        isActive: boolean;
    }>;
    updateSubscriptionStatus(userId: string, dto: {
        plan?: string;
        status: string;
        days?: number;
    }): Promise<{
        id: string;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        startDate: Date;
        endDate: Date;
        userId: string;
    }>;
}
