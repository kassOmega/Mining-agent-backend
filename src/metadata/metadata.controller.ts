import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { CreateMetadataDto } from "./dto/create-metadata.dto";
import { UpdateMetadataDto } from "./dto/update-metadata.dto";
import { MetadataService } from "./metadata.service";

@Controller("metadata")
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get("site-types")
  async getSiteTypes() {
    return this.metadataService.getSiteTypes();
  }

  @Get("mineral-types")
  async getMineralTypes() {
    return this.metadataService.getMineralTypes();
  }

  @Post("site-types")
  @UseGuards(JwtAuthGuard)
  async createSiteType(@Body() dto: CreateMetadataDto) {
    return this.metadataService.createSiteType(dto);
  }

  @Post("mineral-types")
  @UseGuards(JwtAuthGuard)
  async createMineralType(@Body() dto: CreateMetadataDto) {
    return this.metadataService.createMineralType(dto);
  }

  // -------------------------------------------------------------
  // ADMIN UPDATE & DELETE MANAGEMENT ENDPOINTS
  // -------------------------------------------------------------

  @Patch("site-types/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async updateSiteType(
    @Param("id") id: string,
    @Body() dto: UpdateMetadataDto,
  ) {
    return this.metadataService.updateSiteType(id, dto);
  }

  @Delete("site-types/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async deleteSiteType(@Param("id") id: string) {
    return this.metadataService.deleteSiteType(id);
  }

  @Patch("mineral-types/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async updateMineralType(
    @Param("id") id: string,
    @Body() dto: UpdateMetadataDto,
  ) {
    return this.metadataService.updateMineralType(id, dto);
  }

  @Delete("mineral-types/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async deleteMineralType(@Param("id") id: string) {
    return this.metadataService.deleteMineralType(id);
  }
}
