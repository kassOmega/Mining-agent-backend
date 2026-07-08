import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Mods and Admins bypass subscription checks
    if (user.role === "MODERATOR" || user.role === "ADMIN") {
      return true;
    }

    // Clients must have an active subscription that hasn't expired
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!subscription || subscription.status !== "ACTIVE") {
      throw new ForbiddenException(
        "No active subscription found. Please contact admin to activate your account.",
      );
    }

    if (new Date(subscription.endDate) < new Date()) {
      throw new ForbiddenException(
        "Your 30-day subscription has expired. Please contact admin to renew.",
      );
    }

    return true;
  }
}
