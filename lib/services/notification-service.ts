import { prisma } from "@/lib/prisma";
import webpush from "web-push";
import { activityService } from "./activity-service";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@presence.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        VAPID_SUBJECT,
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    );
}

export class NotificationService {
    async createNotification(data: {
        userId: string;
        title: string;
        message: string;
        type: 'attendance' | 'announcement' | 'reminder' | 'leave' | 'info';
        actionUrl?: string;
    }) {
        // 1. Save to database
        const notification = await prisma.notification.create({
            data: {
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type as any,
                actionUrl: data.actionUrl,
                read: false
            }
        });

        // 2. Send push notification in background
        this.sendPushNotification(data.userId, {
            title: data.title,
            body: data.message,
            url: data.actionUrl
        }).catch(err => console.error("Push notification failed:", err));

        return notification;
    }

    async sendPushNotification(userId: string, payload: { title: string; body: string; url?: string }) {
        const subscriptions = await prisma.pushSubscription.findMany({
            where: { userId }
        });

        if (subscriptions.length === 0) return;

        const results = await Promise.allSettled(subscriptions.map(async (sub) => {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth,
                    p256dh: sub.p256dh
                }
            };

            return webpush.sendNotification(
                pushConfig,
                JSON.stringify({
                    title: payload.title,
                    body: payload.body,
                    url: payload.url || "/dashboard/notifications"
                })
            );
        }));

        // Cleanup expired subscriptions
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (result.status === 'rejected' && (result.reason.statusCode === 404 || result.reason.statusCode === 410)) {
                await prisma.pushSubscription.delete({
                    where: { id: subscriptions[i].id }
                }).catch(err => console.error("Failed to delete expired subscription:", err));
            }
        }
    }

    async broadcastNotification(data: {
        companyId: string;
        title: string;
        message: string;
        type: 'announcement' | 'reminder' | 'leave' | 'attendance' | 'info';
        actionUrl?: string;
        role?: string;
        broadcasterId?: string;
    }) {
        const users = await prisma.user.findMany({
            where: {
                companyId: data.companyId,
                ...(data.role ? { role: data.role as any } : {})
            },
            select: { id: true }
        });

        const promises = users.map(user =>
            this.createNotification({
                userId: user.id,
                title: data.title,
                message: data.message,
                type: data.type,
                actionUrl: data.actionUrl
            })
        );

        // Log Activity
        if (data.broadcasterId) {
            promises.push(activityService.logActivity({
                userId: data.broadcasterId,
                companyId: data.companyId,
                action: "BROADCAST_ANNOUNCEMENT",
                description: `Broadcasted ${data.type}: ${data.title}`,
                metadata: { targetRole: data.role || 'all', messageSnippet: data.message.substring(0, 50) }
            }) as any);
        }

        return Promise.all(promises);
    }

    async subscribeToPush(userId: string, subscription: any) {
        return prisma.pushSubscription.upsert({
            where: {
                endpoint: subscription.endpoint
            },
            update: {
                userId,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth
            },
            create: {
                userId,
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth
            }
        });
    }

    async getNotifications(userId: string, limit = 20) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }

    async markAsRead(notificationId: string) {
        return prisma.notification.update({
            where: { id: notificationId },
            data: { read: true }
        });
    }

    async markAllAsRead(userId: string) {
        return prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true }
        });
    }

    async updateNotification(notificationId: string, data: { title?: string; message?: string; type?: any }) {
        return prisma.notification.update({
            where: { id: notificationId },
            data
        });
    }

    async deleteNotification(notificationId: string) {
        return prisma.notification.delete({
            where: { id: notificationId }
        });
    }

    async deleteAllNotifications(userId: string) {
        return prisma.notification.deleteMany({
            where: { userId }
        });
    }
}

export const notificationService = new NotificationService();
