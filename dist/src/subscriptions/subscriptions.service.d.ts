import { SubscriptionPlan } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";
export declare class SubscriptionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getPlans(): {
        plan: string;
        price: number;
        maxSites: number;
        features: string[];
    }[];
    getCurrentSubscription(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        startDate: Date;
        endDate: Date;
        userId: string;
    }>;
    initiatePayment(userId: string, plan: SubscriptionPlan): Promise<{
        message: string;
        plan: {
            plan: string;
            price: number;
            maxSites: number;
            features: string[];
        };
        paymentUrl: null;
    }>;
    upgradeSubscription(userId: string, plan: SubscriptionPlan): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        startDate: Date;
        endDate: Date;
        userId: string;
    }>;
}
