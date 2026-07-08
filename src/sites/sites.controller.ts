// backend/src/sites/sites.controller.ts

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import {
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express";
import * as fs from "fs";
import { diskStorage } from "multer";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { SubscriptionGuard } from "../common/guards/subscription.guard";
import {
  CreateSiteDto,
  FilterSitesDto,
  UpdateSiteDto,
  VerifySiteDto,
} from "./dto/create-site.dto";
import { SitesService } from "./sites.service";

// Configure multer for file uploads
const pictureFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException("Only image files are allowed for pictures"),
      false,
    );
  }
};

const videoFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new BadRequestException("Only video files are allowed"), false);
  }
};

const receiptFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException(
        "Only image files are allowed for payment receipts",
      ),
      false,
    );
  }
};

const receiptStorage = {
  destination: (req: any, file: any, cb: any) => {
    const uploadPath = path.join(process.cwd(), "public", "receipts");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname);
    const filename = `receipt-${uuidv4()}${ext}`; // Clear matching prefix token
    cb(null, filename);
  },
};

const documentFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype.startsWith("application/") ||
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException("Only document or image files are allowed"),
      false,
    );
  }
};

const documentStorage = {
  destination: (req: any, file: any, cb: any) => {
    const uploadPath = path.join(process.cwd(), "public", "documents");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
};

const pictureStorage = {
  destination: (req: any, file: any, cb: any) => {
    const uploadPath = path.join(process.cwd(), "public", "pictures");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
};

const videoStorage = {
  destination: (req: any, file: any, cb: any) => {
    const uploadPath = path.join(process.cwd(), "public", "videos");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
};

@Controller("sites")
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  // ==========================================
  // PUBLIC ENDPOINTS (No auth required)
  // ==========================================

  @Get("public")
  async getPublicSites(@Query() query: FilterSitesDto) {
    return this.sitesService.getPublicSites(query);
  }

  @Get("public/:id")
  async getPublicSite(@Param("id") id: string) {
    return this.sitesService.getPublicSite(id);
  }

  // ==========================================
  // CLIENT ENDPOINTS
  // ==========================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles("CLIENT", "MODERATOR", "ADMIN")
  @HttpCode(HttpStatus.CREATED)
  async createSite(@CurrentUser() user: any, @Body() dto: CreateSiteDto) {
    return this.sitesService.createSite(user.id, dto, user.role); // <-- Pass user.role
  }

  @Get("my")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("CLIENT", "MODERATOR", "ADMIN")
  async getMySites(@CurrentUser() user: any) {
    return this.sitesService.getMySites(user.id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
  @Roles("CLIENT", "MODERATOR", "ADMIN")
  async updateSite(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body() dto: UpdateSiteDto,
  ) {
    return this.sitesService.updateSite(user.id, id, dto, user.role); // <-- Pass user.role
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("CLIENT", "MODERATOR", "ADMIN")
  @HttpCode(HttpStatus.OK)
  async deleteSite(@CurrentUser() user: any, @Param("id") id: string) {
    return this.sitesService.deleteSite(user.id, id, user.role); // <-- Pass user.role
  }

  // ==========================================
  // MEDIA UPLOAD ENDPOINTS
  // ==========================================

  @Post(":id/pictures")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("CLIENT", "MODERATOR", "ADMIN")
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "pictures", maxCount: 10 }], {
      fileFilter: pictureFilter,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per picture
        files: 10,
      },
      storage: diskStorage({ ...pictureStorage }), // <-- FIXED HERE
    }),
  )
  @HttpCode(HttpStatus.OK)
  async uploadPictures(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @UploadedFiles() files: { pictures?: Express.Multer.File[] },
  ) {
    if (!files.pictures || files.pictures.length === 0)
      throw new BadRequestException("No pictures uploaded");
    const picturePaths = files.pictures.map(
      (file) => `/pictures/${file.filename}`,
    );
    return this.sitesService.addPictures(id, user.id, user.role, picturePaths); // <-- ADD user.role
  }

  @Post(":id/receipt")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("CLIENT", "MODERATOR", "ADMIN")
  @UseInterceptors(
    FileInterceptor("receipt", {
      // 👈 Changed to single FileInterceptor
      fileFilter: receiptFilter,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB file limit boundary
      },
      storage: diskStorage({ ...receiptStorage }),
    }),
  )
  @HttpCode(HttpStatus.OK)
  async uploadReceipt(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File, // 👈 Changed to single @UploadedFile() signature
  ) {
    if (!file) {
      throw new BadRequestException("No receipt document file uploaded");
    }

    // Direct access via the single object payload injection variable instead of indexing arrays
    const receiptPath = `/receipts/${file.filename}`;

    return this.sitesService.setReceiptImage(
      id,
      user.id,
      user.role,
      receiptPath,
    );
  }

  @Post(":id/video")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("CLIENT", "MODERATOR", "ADMIN")
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "video", maxCount: 1 }], {
      fileFilter: videoFilter,
      limits: {
        fileSize: 26 * 1024 * 1024, // 25MB + 1MB buffer
        files: 1,
      },
      storage: diskStorage({ ...videoStorage }), // <-- FIXED HERE
    }),
  )
  @HttpCode(HttpStatus.OK)
  async uploadVideo(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @UploadedFiles() files: { video?: Express.Multer.File[] },
  ) {
    if (!files.video || files.video.length === 0)
      throw new BadRequestException("No video uploaded");
    const videoPath = `/videos/${files.video[0].filename}`;
    return this.sitesService.setVideo(id, user.id, user.role, videoPath); // <-- ADD user.role
  }

  @Delete(":id/pictures")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("CLIENT", "MODERATOR", "ADMIN")
  @HttpCode(HttpStatus.OK)
  async removePicture(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body("path") picturePath: string,
  ) {
    if (!picturePath) throw new BadRequestException("Picture path is required");
    return this.sitesService.removePicture(id, user.id, user.role, picturePath); // <-- ADD user.role
  }

  // ==========================================
  // DOCUMENT UPLOAD ENDPOINTS
  // ==========================================

  @Post(":id/documents")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("CLIENT", "MODERATOR", "ADMIN")
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: "documents", maxCount: 5 }], // Max 5 legal docs per site
      {
        fileFilter: documentFilter,
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per doc
        storage: diskStorage({ ...documentStorage }), // <-- FIXED HERE
      },
    ),
  )
  @HttpCode(HttpStatus.OK)
  async uploadDocuments(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @UploadedFiles() files: { documents?: Express.Multer.File[] },
  ) {
    if (!files.documents || files.documents.length === 0) {
      throw new BadRequestException("No documents uploaded");
    }

    const docsData = files.documents.map((file) => ({
      path: `/documents/${file.filename}`,
      originalName: file.originalname,
    }));

    return this.sitesService.addDocuments(id, user.id, user.role, docsData);
  }

  @Delete("documents/:docId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("CLIENT", "MODERATOR", "ADMIN")
  @HttpCode(HttpStatus.OK)
  async removeDocument(
    @CurrentUser() user: any,
    @Param("docId") docId: string,
  ) {
    return this.sitesService.removeDocument(docId, user.id, user.role);
  }

  // ==========================================
  // MODERATOR/ADMIN ENDPOINTS
  // ==========================================

  @Get("pending")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("MODERATOR", "ADMIN")
  async getPendingSites(@Query() query: any) {
    return this.sitesService.getPendingSites();
  }

  @Get("all")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("MODERATOR", "ADMIN")
  async getAllSites(@Query() query: any & { status?: string }) {
    return this.sitesService.getAllSites(query as any);
  }

  @Get("manage/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("MODERATOR", "ADMIN")
  async getSiteForEdit(@Param("id") id: string) {
    return this.sitesService.getSiteForEdit(id);
  }

  @Patch(":id/verify")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("MODERATOR", "ADMIN")
  @HttpCode(HttpStatus.OK)
  async verifySite(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body() dto: VerifySiteDto,
  ) {
    return this.sitesService.verifySite(user.id, id, dto);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("MODERATOR", "ADMIN")
  @HttpCode(HttpStatus.OK)
  async changeStatus(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body("status") status: "PENDING" | "VERIFIED" | "REJECTED",
    @Body("rejectionReason") rejectionReason?: string,
  ) {
    return this.sitesService.changeStatus(id, {
      userId: user.id,
      userRole: user.role,
      status,
      rejectionReason: rejectionReason || null,
    });
  }

  @Patch(":id/featured")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("MODERATOR", "ADMIN")
  @HttpCode(HttpStatus.OK)
  async toggleFeatured(@Param("id") id: string) {
    return this.sitesService.toggleFeatured(id);
  }

  @Delete("admin/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  async deleteAnySite(@Param("id") id: string) {
    return this.sitesService.deleteAnySite(id);
  }

  // ==========================================
  // STATS
  // ==========================================

  @Get("stats/dashboard")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("MODERATOR", "ADMIN")
  async getStats() {
    return this.sitesService.getStats();
  }
}
