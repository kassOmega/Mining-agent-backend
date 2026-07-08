"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let SubscriptionsService = class SubscriptionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getPlans() {
        return [
            {
                plan: "FREE",
                price: 0,
                maxSites: 3,
                features: [
                    "Post up to 3 mining sites",
                    "Basic site visibility",
                    "Email notifications",
                    "Standard support",
                ],
            },
            {
                plan: "BASIC",
                price: 500,
                maxSites: 10,
                features: [
                    "Post up to 10 mining sites",
                    "Priority in search results",
                    "Email notifications",
                    "Contact request forwarding",
                    "Priority support",
                ],
            },
            {
                plan: "PREMIUM",
                price: 1500,
                maxSites: -1,
                features: [
                    "Unlimited mining sites",
                    "Featured listings available",
                    "Top placement in search",
                    "Direct contact form",
                    "Analytics dashboard",
                    "Dedicated support",
                    "Verified badge",
                ],
            },
        ];
    }
    async getCurrentSubscription(userId) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { userId },
        });
        if (!subscription) {
            throw new common_1.NotFoundException("Subscription not found");
        }
        return subscription;
    }
    async initiatePayment(userId, plan) {
        const plans = this.getPlans();
        const selectedPlan = plans.find((p) => p.plan === plan);
        if (!selectedPlan) {
            throw new common_1.NotFoundException("Invalid plan selected");
        }
        return {
            message: "Payment integration coming soon",
            plan: selectedPlan,
            paymentUrl: null,
        };
    }
    async upgradeSubscription(userId, plan) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        return this.prisma.subscription.update({
            where: { userId },
            data: {
                plan,
                status: "ACTIVE",
                startDate,
                endDate,
            },
        });
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map