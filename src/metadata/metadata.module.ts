import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service"; // Adjust import paths matching your repo layout
import { MetadataController } from "./metadata.controller";
import { MetadataService } from "./metadata.service";

@Module({
  controllers: [MetadataController],
  providers: [MetadataService, PrismaService],
  exports: [MetadataService],
})
export class MetadataModule {}
