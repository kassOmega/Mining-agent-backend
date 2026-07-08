// backend/src/subscriptions/subscriptions.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { SubscriptionPlan } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

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
        price: 500, // ETB per month
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
        price: 1500, // ETB per month
        maxSites: -1, // Unlimited
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

  async getCurrentSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    return subscription;
  }

  // TODO: Integrate with actual payment gateway (Chapa, Telebirr)
  async initiatePayment(userId: string, plan: SubscriptionPlan) {
    const plans = this.getPlans();
    const selectedPlan = plans.find((p) => p.plan === plan);

    if (!selectedPlan) {
      throw new NotFoundException("Invalid plan selected");
    }

    // In production, integrate with Chapa/Telebirr here
    // For now, return a mock response
    return {
      message: "Payment integration coming soon",
      plan: selectedPlan,
      paymentUrl: null,
    };
  }

  async upgradeSubscription(userId: string, plan: SubscriptionPlan) {
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
        // paymentRef removed - handled manually now
      },
    });
  }
}
