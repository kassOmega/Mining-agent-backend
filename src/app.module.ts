import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path"; // Cleaned up the raw inline require()
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./common/prisma.module";
import { ContactModule } from "./contact/contact.module";
import { LocationsModule } from "./locations/locations.module";
import { MetadataModule } from "./metadata/metadata.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { SitesModule } from "./sites/sites.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), "public"),
      serveRoot: "/api",
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SitesModule,
    LocationsModule,
    NotificationsModule,
    SubscriptionsModule,
    ContactModule,
    MetadataModule,
  ],
})
export class AppModule {}
