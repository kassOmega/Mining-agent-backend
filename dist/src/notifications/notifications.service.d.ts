import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../common/prisma.service";
export declare class NotificationsService {
    private prisma;
    private configService;
    private transporter;
    constructor(prisma: PrismaService, configService: ConfigService);
    private sendEmail;
    notifyModeratorsNewPost(site: any): Promise<void>;
    notifySiteVerified(email: string, siteTitle: string): Promise<void>;
    notifySiteRejected(email: string, siteTitle: string, reason: string): Promise<void>;
    notifySubscribersNewSite(site: any): Promise<void>;
    getUserNotifications(userId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        message: string;
        type: string;
        isRead: boolean;
    }[]>;
    markAsRead(notificationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        message: string;
        type: string;
        isRead: boolean;
    } | null>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUnreadCount(userId: string): Promise<number>;
    notifySubscriptionExpiringSoon(email: string, name: string, daysLeft: number): Promise<void>;
}
