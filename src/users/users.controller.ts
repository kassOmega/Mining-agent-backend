import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "MODERATOR")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("role") role?: UserRole,
    @Query("search") search?: string,
  ) {
    return this.usersService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      role,
      search,
    });
  }

  // ---> ADD THIS ENDPOINT <---
  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param("id") id: string,
    @Body() body: { fullName?: string; phone?: string },
  ) {
    return this.usersService.updateUser(id, body);
  }

  // ---> ADD THIS ENDPOINT <---
  @Patch(":id/subscription-status")
  @HttpCode(HttpStatus.OK)
  async updateSubscriptionStatus(
    @Param("id") id: string,
    @Body() body: { plan?: string; status: string; days?: number },
  ) {
    return this.usersService.updateSubscriptionStatus(id, body);
  }

  @Patch(":id/toggle-status")
  @HttpCode(HttpStatus.OK)
  async toggleStatus(@Param("id") id: string) {
    return this.usersService.toggleStatus(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param("id") id: string) {
    return this.usersService.delete(id);
  }
}
