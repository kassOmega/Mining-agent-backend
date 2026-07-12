import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import helmet from "helmet";
import * as path from "path";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 1. Security Headers
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === "production" ? undefined : false,

      crossOriginResourcePolicy: { policy: "cross-origin" },

      crossOriginEmbedderPolicy: false,
    }),
  );

  // 2. Global Prefix
  app.setGlobalPrefix("api");

  // 3. Strict Production CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });

  // 4. Cookies & JSON Parsers
  app.use(cookieParser());
  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ extended: true, limit: "30mb" }));

  // 5. Serve static files (Note: Switch to S3-compatible cloud storage if scaling horizontally)
  app.use(
    "/pictures",
    express.static(path.join(__dirname, "..", "public", "pictures")),
  );
  app.use(
    "/videos",
    express.static(path.join(__dirname, "..", "public", "videos")),
  );
  app.use(
    "/documents",
    express.static(path.join(__dirname, "..", "public", "documents")),
  );
  app.use(
    "/receipts",
    express.static(path.join(__dirname, "..", "public", "receipts")),
  );

  // 6. Global Input Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 7. Swagger documentation (Development Only)
  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("Mining Investment Platform API")
      .setDescription("API for connecting mining site owners with investors")
      .setVersion("1.0")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
  }

  // 8. Lifecycle Management
  app.enableShutdownHooks();

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(
    `[${process.env.NODE_ENV || "development"}] Application running on port: ${port}`,
  );
}
bootstrap();
