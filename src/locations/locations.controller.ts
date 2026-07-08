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
import { LocationsService } from "./locations.service";

@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get("zones")
  async getZones() {
    return this.locationsService.getZones();
  }

  @Get("zones/:zoneId/woredas")
  async getWoredas(@Param("zoneId") zoneId: string) {
    return this.locationsService.getWoredasByZone(zoneId);
  }

  @Get("woredas/:woredaId/kebeles")
  async getKebeles(@Param("woredaId") woredaId: string) {
    return this.locationsService.getKebelesByWoreda(woredaId);
  }

  // -------------------------------------------------------------
  // ADMIN CONTROL MANAGEMENT ROUTES
  // -------------------------------------------------------------

  @Post("zones")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async createZone(@Body() body: { name: string }) {
    return this.locationsService.createZone(body);
  }

  @Patch("zones/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async updateZone(@Param("id") id: string, @Body() body: { name: string }) {
    return this.locationsService.updateZone(id, body);
  }

  @Delete("zones/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async deleteZone(@Param("id") id: string) {
    return this.locationsService.deleteZone(id);
  }

  @Post("woredas")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async createWoreda(@Body() body: { name: string; zoneId: string }) {
    return this.locationsService.createWoreda(body);
  }

  @Patch("woredas/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async updateWoreda(
    @Param("id") id: string,
    @Body() body: { name: string; zoneId?: string },
  ) {
    return this.locationsService.updateWoreda(id, body);
  }

  @Delete("woredas/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async deleteWoreda(@Param("id") id: string) {
    return this.locationsService.deleteWoreda(id);
  }

  @Post("kebeles")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async createKebele(@Body() body: { name: string; woredaId: string }) {
    return this.locationsService.createKebele(body);
  }

  @Patch("kebeles/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async updateKebele(
    @Param("id") id: string,
    @Body() body: { name: string; woredaId?: string },
  ) {
    return this.locationsService.updateKebele(id, body);
  }

  @Delete("kebeles/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  async deleteKebele(@Param("id") id: string) {
    return this.locationsService.deleteKebele(id);
  }
}
