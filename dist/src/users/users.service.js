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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
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
    async updateRole(userId, role) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
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
    async toggleStatus(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
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
    async delete(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        await this.prisma.user.delete({ where: { id: userId } });
        return { message: "User deleted successfully" };
    }
    async updateUser(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
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
    async updateSubscriptionStatus(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: true },
        });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        let endDate = user.subscription?.endDate;
        if (dto.days) {
            const baseDate = user.subscription?.endDate
                ? new Date(user.subscription.endDate)
                : new Date();
            endDate = new Date(baseDate.getTime() + dto.days * 24 * 60 * 60 * 1000);
        }
        return this.prisma.subscription.update({
            where: { userId },
            data: {
                plan: dto.plan || user.subscription?.plan || "FREE",
                status: dto.status ||
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map