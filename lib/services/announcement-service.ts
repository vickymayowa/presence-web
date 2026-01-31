import { prisma } from "@/lib/prisma";
import { activityService } from "./activity-service";
import { notificationService } from "./notification-service";

export class AnnouncementService {
    async getAnnouncements(companyId: string) {
        return prisma.announcement.findMany({
            where: {
                companyId,
                isActive: true
            },
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async createAnnouncement(companyId: string, authorId: string, data: { title: string, content: string, type?: string, expiresAt?: Date }) {
        const announcement = await prisma.announcement.create({
            data: {
                title: data.title,
                content: data.content,
                type: data.type || "general",
                expiresAt: data.expiresAt,
                companyId,
                authorId
            },
            include: {
                author: true
            }
        });

        // Broadcast notification to all employees
        await notificationService.broadcastNotification({
            companyId,
            title: "New Announcement: " + data.title,
            message: data.content.substring(0, 100) + (data.content.length > 100 ? "..." : ""),
            type: 'announcement',
            actionUrl: '/dashboard/announcements'
        }).catch(e => console.error("Broadcast failed", e));

        // Log Activity
        await activityService.logActivity({
            userId: authorId,
            companyId,
            action: "CREATE_ANNOUNCEMENT",
            description: `Published announcement: ${data.title}`,
            metadata: { announcementId: announcement.id }
        }).catch(e => console.error("Activity Log failed", e));

        return announcement;
    }

    async updateAnnouncement(id: string, data: any) {
        return prisma.announcement.update({
            where: { id },
            data
        });
    }

    async deleteAnnouncement(id: string) {
        return prisma.announcement.delete({
            where: { id }
        });
    }
}

export const announcementService = new AnnouncementService();
