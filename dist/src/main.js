"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const cookieParser = require("cookie-parser");
const express = require("express");
const helmet_1 = require("helmet");
const path = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
    }));
    app.setGlobalPrefix("api");
    app.enableCors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    });
    app.use(cookieParser());
    app.use(express.json({ limit: "30mb" }));
    app.use(express.urlencoded({ extended: true, limit: "30mb" }));
    app.use("/pictures", express.static(path.join(__dirname, "..", "public", "pictures")));
    app.use("/videos", express.static(path.join(__dirname, "..", "public", "videos")));
    app.use("/documents", express.static(path.join(__dirname, "..", "public", "documents")));
    app.use("/receipts", express.static(path.join(__dirname, "..", "public", "receipts")));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    if (process.env.NODE_ENV !== "production") {
        const config = new swagger_1.DocumentBuilder()
            .setTitle("Mining Investment Platform API")
            .setDescription("API for connecting mining site owners with investors")
            .setVersion("1.0")
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup("api/docs", app, document);
    }
    app.enableShutdownHooks();
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`[${process.env.NODE_ENV || "development"}] Application running on port: ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map