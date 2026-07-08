"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
const prisma_service_1 = require("../common/prisma.service");
let NotificationsService = class NotificationsService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get("SMTP_HOST"),
            port: parseInt(this.configService.get("SMTP_PORT") || "587"),
            secure: false,
            auth: {
                user: this.configService.get("SMTP_USER"),
                pass: this.configService.get("SMTP_PASSWORD"),
            },
        });
    }
    async sendEmail(to, subject, html) {
        try {
            await this.transporter.sendMail({
                from: this.configService.get("EMAIL_FROM"),
                to,
                subject,
                html,
            });
            console.log(`Email sent to ${to}: ${subject}`);
        }
        catch (error) {
            console.error(`Failed to send email to ${to}:`, error);
        }
    }
    async notifyModeratorsNewPost(site) {
        const moderators = await this.prisma.user.findMany({
            where: {
                role: { in: ["MODERATOR", "ADMIN"] },
                isActive: true,
            },
            select: { email: true, fullName: true },
        });
        const location = `${site.kebele?.woreda?.zone?.name}, ${site.kebele?.woreda?.name}, ${site.kebele?.name}`;
        for (const mod of moderators) {
            const subject = "🔍 New Mining Site Pending Review";
            const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a56db;">New Site Submitted for Review</h2>
          <p>Dear ${mod.fullName},</p>
          <p>A new mining site has been submitted and requires your review:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Title:</strong> ${site.title}</p>
            <p><strong>Type:</strong> ${site.siteType}</p>
            <p><strong>Mineral:</strong> ${site.mineralType}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>Please log in to the admin panel to review and verify this site.</p>
          <a href="${this.configService.get("FRONTEND_URL")}/site/pending" 
             style="background: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Review Site
          </a>
          <p style="margin-top: 30px; color: #6b7280; font-size: 12px;">
            This is an automated notification from Mining Platform.
          </p>
        </div>
      `;
            await this.sendEmail(mod.email, subject, html);
        }
    }
    async notifySiteVerified(email, siteTitle) {
        const subject = "✅ Your Mining Site Has Been Verified";
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Site Verified Successfully!</h2>
        <p>Great news!</p>
        <p>Your mining site <strong>"${siteTitle}"</strong> has been reviewed and verified by our team.</p>
        <p>Your site is now visible to all users on the platform.</p>
        <a href="${this.configService.get("FRONTEND_URL")}/my-sites" 
           style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View My Sites
        </a>
        <p style="margin-top: 30px; color: #6b7280; font-size: 12px;">
          This is an automated notification from Mining Platform.
        </p>
      </div>
    `;
        await this.sendEmail(email, subject, html);
    }
    async notifySiteRejected(email, siteTitle, reason) {
        const subject = "❌ Your Mining Site Was Not Approved";
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Site Not Approved</h2>
        <p>Your mining site <strong>"${siteTitle}"</strong> was not approved.</p>
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <p><strong>Reason:</strong> ${reason}</p>
        </div>
        <p>You can edit and resubmit your site for review.</p>
        <a href="${this.configService.get("FRONTEND_URL")}/my-sites" 
           style="background: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View My Sites
        </a>
        <p style="margin-top: 30px; color: #6b7280; font-size: 12px;">
          This is an automated notification from Mining Platform.
        </p>
      </div>
    `;
        await this.sendEmail(email, subject, html);
    }
    async notifySubscribersNewSite(site) {
        const subscribers = await this.prisma.user.findMany({
            where: {
                role: "CLIENT",
                isActive: true,
                subscription: {
                    status: "ACTIVE",
                },
            },
            select: { email: true, fullName: true },
        });
        const location = `${site.kebele?.woreda?.zone?.name}, ${site.kebele?.woreda?.name}, ${site.kebele?.name}`;
        for (const sub of subscribers) {
            const subject = "🆕 New Mining Site Available";
            const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a56db;">New Mining Site Listed</h2>
          <p>Dear ${sub.fullName},</p>
          <p>A new verified mining site is now available on our platform:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Title:</strong> ${site.title}</p>
            <p><strong>Type:</strong> ${site.siteType}</p>
            <p><strong>Mineral:</strong> ${site.mineralType}</p>
            <p><strong>Location:</strong> ${location}</p>
            ${site.areaSize ? `<p><strong>Area Size:</strong> ${site.areaSize} hectares</p>` : ""}
          </div>
          <a href="${this.configService.get("FRONTEND_URL")}/sites/${site.id}" 
             style="background: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Site Details
          </a>
          <p style="margin-top: 30px; color: #6b7280; font-size: 12px;">
            You're receiving this because you're subscribed to Mining Platform.
            <br>
            <a href="#" style="color: #6b7280;">Unsubscribe</a>
          </p>
        </div>
      `;
            await this.sendEmail(sub.email, subject, html);
        }
    }
    async getUserNotifications(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 50,
        });
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.prisma.notification.findFirst({
            where: { id: notificationId, userId },
        });
        if (!notification) {
            return null;
        }
        return this.prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: { userId, isRead: false },
        });
    }
    async notifySubscriptionExpiringSoon(email, name, daysLeft) {
        const subject = `⚠️ Subscription Expiring in ${daysLeft} Days`;
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d97706;">Action Required: Subscription Expiring</h2>
        <p>Dear ${name},</p>
        <p>Your 30-day subscription on MiningPlatform will expire in <strong>${daysLeft} days</strong>.</p>
        <p>To avoid interruption in posting sites, please contact the admin to renew your subscription.</p>
        <p style="margin-top: 30px; color: #6b7280; font-size: 12px;">This is an automated notification from Mining Platform.</p>
      </div>
    `;
        await this.sendEmail(email, subject, html);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map