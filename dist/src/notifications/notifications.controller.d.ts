import { NotificationsService } from "./notifications.service";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(user: any): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        message: string;
        type: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(user: any): Promise<{
        count: number;
    }>;
    markAsRead(user: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        message: string;
        type: string;
        isRead: boolean;
    } | null>;
    markAllAsRead(user: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
