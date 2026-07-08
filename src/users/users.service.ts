// backend/src/users/users.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { SubscriptionPlan, SubscriptionStatus, UserRole } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.role) {
      where.role = query.role;
    }

    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: "insensitive" } },
        { fullName: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          subscription: {
            select: {
              plan: true,
              status: true,
              endDate: true,
            },
          },
          _count: {
            select: {
              ownedSites: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateRole(userId: string, role: UserRole) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });
  }

  async toggleStatus(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true,
      },
    });
  }

  async delete(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.prisma.user.delete({ where: { id: userId } });

    return { message: "User deleted successfully" };
  }

  // ==========================================
  // MODERATOR/ADMIN: Update user details (name, phone)
  // ==========================================
  async updateUser(userId: string, dto: { fullName?: string; phone?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: dto.fullName !== undefined ? dto.fullName : user.fullName,
        phone: dto.phone !== undefined ? dto.phone : user.phone,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        userType: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  // ==========================================
  // MODERATOR/ADMIN: Update subscription payment status and date
  // ==========================================
  async updateSubscriptionStatus(
    userId: string,
    dto: { plan?: string; status: string; days?: number },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });
    if (!user) throw new NotFoundException("User not found");

    let endDate = user.subscription?.endDate;

    // If extending subscription, add days to the current endDate, or use a specific date
    if (dto.days) {
      const baseDate = user.subscription?.endDate
        ? new Date(user.subscription.endDate)
        : new Date();
      endDate = new Date(baseDate.getTime() + dto.days * 24 * 60 * 60 * 1000);
    }

    return this.prisma.subscription.update({
      where: { userId },
      data: {
        plan:
          (dto.plan as SubscriptionPlan) || user.subscription?.plan || "FREE",
        status:
          (dto.status as SubscriptionStatus) ||
          user.subscription?.status ||
          "ACTIVE",
        endDate: endDate,
      },
      select: {
        id: true,
        userId: true,
        plan: true,
        status: true,
        startDate: true,
        endDate: true,
      },
    });
  }
}
