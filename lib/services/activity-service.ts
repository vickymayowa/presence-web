import { prisma } from "@/lib/prisma";

export class ActivityService {
    async logActivity(data: {
        userId: string;
        companyId: string;
        action: string;
        description?: string;
        metadata?: any;
    }) {
        try {
            return await prisma.activityLog.create({
                data: {
                    userId: data.userId,
                    companyId: data.companyId,
                    action: data.action,
                    description: data.description,
                    metadata: data.metadata || {}
                }
            });
        } catch (error) {
            console.error("[ActivityLog Error]:", error);
            // Don't throw error to avoid breaking main flow
        }
    }

    async getRecentActivities(companyId: string, limit = 10) {
        return prisma.activityLog.findMany({
            where: { companyId },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        role: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }

    async getUserActivities(userId: string, limit = 10) {
        return prisma.activityLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }
}

export const activityService = new ActivityService();
