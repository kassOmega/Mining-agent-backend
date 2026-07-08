// backend/src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../common/interfaces";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = configService.get<string>("JWT_SECRET");

    // Safety guard: Crash instantly on startup with a clear error if the environment variable is missing
    if (!jwtSecret) {
      throw new Error(
        "FATAL EXCEPTION: JWT_SECRET environment variable is missing or undefined in ConfigService.",
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("User not found or deactivated");
    }

    // This return object gets attached directly to the Request context as req.user
    return user;
  }
}
