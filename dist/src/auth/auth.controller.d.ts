import { AuthService } from "./auth.service";
interface RegisterBody {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
}
interface LoginBody {
    email: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(user: any, body: RegisterBody): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        fullName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        userType: import(".prisma/client").$Enums.UserType;
    }>;
    login(body: LoginBody): Promise<{
        user: {
            subscription: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                plan: import(".prisma/client").$Enums.SubscriptionPlan;
                status: import(".prisma/client").$Enums.SubscriptionStatus;
                startDate: Date;
                endDate: Date;
                userId: string;
            } | null;
            id: string;
            createdAt: Date;
            email: string;
            fullName: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            userType: import(".prisma/client").$Enums.UserType;
            isActive: boolean;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    getProfile(user: any): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        fullName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        userType: import(".prisma/client").$Enums.UserType;
        isActive: boolean;
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            plan: import(".prisma/client").$Enums.SubscriptionPlan;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            startDate: Date;
            endDate: Date;
            userId: string;
        } | null;
        _count: {
            ownedSites: number;
        };
    }>;
}
export {};
