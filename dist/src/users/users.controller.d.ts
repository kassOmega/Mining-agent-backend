import { UserRole } from "@prisma/client";
import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: string, limit?: string, role?: UserRole, search?: string): Promise<{
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
    updateUser(id: string, body: {
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
    updateSubscriptionStatus(id: string, body: {
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
    toggleStatus(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        isActive: boolean;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
}
