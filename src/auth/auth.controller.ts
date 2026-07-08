// backend/src/auth/auth.controller.ts

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
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { AuthService } from "./auth.service";

interface RegisterBody {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "MODERATOR")
  @HttpCode(HttpStatus.CREATED)
  async register(@CurrentUser() user: any, @Body() body: RegisterBody) {
    return this.authService.register(user.role, body); // <-- ADD user.role HERE
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginBody) {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }
}
