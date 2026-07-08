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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../common/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService, notificationsService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.notificationsService = notificationsService;
    }
    async register(callerRole, dto) {
        if (callerRole !== "ADMIN" && callerRole !== "MODERATOR") {
            throw new common_1.UnauthorizedException("Only admins or moderators can register new users.");
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (existingUser) {
            throw new common_1.ConflictException("Email already registered");
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email.toLowerCase(),
                passwordHash,
                fullName: dto.fullName,
                phone: dto.phone,
                userType: dto.userType || "OWNER",
                role: "CLIENT",
                isActive: true,
                subscription: {
                    create: {
                        plan: "FREE",
                        status: "ACTIVE",
                        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    },
                },
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                userType: true,
                createdAt: true,
            },
        });
        return user;
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
            include: { subscription: true },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException("Invalid credentials or account deactivated");
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        if (user.subscription && user.subscription.endDate) {
            const daysLeft = Math.ceil((new Date(user.subscription.endDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24));
            if (daysLeft <= 5 && daysLeft > 0) {
                await this.notificationsService.notifySubscriptionExpiringSoon(user.email, user.fullName, daysLeft);
            }
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        const { passwordHash, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken,
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                userType: true,
                isActive: true,
                createdAt: true,
                subscription: true,
                _count: {
                    select: {
                        ownedSites: true,
                    },
                },
            },
        });
        if (!user)
            throw new common_1.UnauthorizedException("User not found");
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        notifications_service_1.NotificationsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map