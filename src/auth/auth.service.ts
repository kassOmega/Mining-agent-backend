// backend/src/auth/auth.service.ts

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { JwtPayload } from "../common/interfaces";
import { PrismaService } from "../common/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";

interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  userType?: "OWNER" | "BROKER";
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private notificationsService: NotificationsService,
  ) {}

  async register(callerRole: string, dto: RegisterDto) {
    if (callerRole !== "ADMIN" && callerRole !== "MODERATOR") {
      throw new UnauthorizedException(
        "Only admins or moderators can register new users.",
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException("Email already registered");
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

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { subscription: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        "Invalid credentials or account deactivated",
      );
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // --- 5-DAY EXPIRY WARNING ---
    if (user.subscription && user.subscription.endDate) {
      const daysLeft = Math.ceil(
        (new Date(user.subscription.endDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      );
      if (daysLeft <= 5 && daysLeft > 0) {
        await this.notificationsService.notifySubscriptionExpiringSoon(
          user.email,
          user.fullName,
          daysLeft,
        );
      }
    }

    const payload: JwtPayload = {
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

  async getProfile(userId: string) {
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
            ownedSites: true, // FIX: Changed from 'sites' to 'ownedSites' to match schema relation name
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException("User not found");
    return user;
  }
}
