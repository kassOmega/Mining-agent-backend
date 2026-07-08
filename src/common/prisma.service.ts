// backend/src/common/prisma.service.ts

import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Prisma 7 requires passing configuration options here instead of the schema file
    super({
      datasourceUrl: process.env.DATABASE_URL,
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log("Database connected successfully");
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
