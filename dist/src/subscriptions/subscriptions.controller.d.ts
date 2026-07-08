import { SubscriptionsService } from "./subscriptions.service";
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    getPlans(): Promise<{
        plan: string;
        price: number;
        maxSites: number;
        features: string[];
    }[]>;
    getCurrent(user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        plan: import(".prisma/client").$Enums.SubscriptionPlan;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        startDate: Date;
        endDate: Date;
        userId: string;
    }>;
    checkout(user: any, plan: string): Promise<{
        message: string;
        plan: {
            plan: string;
            price: number;
            maxSites: number;
            features: string[];
        };
        paymentUrl: null;
    }>;
}
