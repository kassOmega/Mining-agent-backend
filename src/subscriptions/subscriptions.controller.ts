// backend/src/subscriptions/subscriptions.controller.ts

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { SubscriptionsService } from "./subscriptions.service";

@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get("plans")
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @UseGuards(JwtAuthGuard)
  @Get("current")
  async getCurrent(@CurrentUser() user: any) {
    return this.subscriptionsService.getCurrentSubscription(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("checkout")
  @HttpCode(HttpStatus.OK)
  async checkout(@CurrentUser() user: any, @Body("plan") plan: string) {
    return this.subscriptionsService.initiatePayment(user.id, plan as any);
  }
}
