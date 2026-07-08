import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { JwtPayload } from "../common/interfaces";
import { PrismaService } from "../common/prisma.service";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
}
export {};
