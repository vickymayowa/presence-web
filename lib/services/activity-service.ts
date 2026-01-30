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
            console.log("[ActivityLog] Attempting to log activity:", {
                userId: data.userId,
                companyId: data.companyId,
                action: data.action,
                description: data.description
            });

            const result = await prisma.activityLog.create({
                data: {
                    userId: data.userId,
                    companyId: data.companyId,
                    action: data.action,
                    description: data.description,
                    metadata: data.metadata || {}
                }
            });

            console.log("[ActivityLog] Successfully created activity log:", result.id);
            return result;
        } catch (error) {
            console.error("[ActivityLog Error]:", error);
            console.error("[ActivityLog Error Details]:", {
                message: error instanceof Error ? error.message : 'Unknown error',
                userId: data.userId,
                companyId: data.companyId,
                action: data.action
            });
            // Don't throw error to avoid breaking main flow
            return null;
        }
    }

    async getRecentActivities(companyId: string, limit = 10) {
        try {
            console.log("[ActivityLog] Fetching recent activities for company:", companyId, "limit:", limit);

            const activities = await prisma.activityLog.findMany({
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

            console.log(activities);
            return activities;
        } catch (error) {
            console.error("[ActivityLog] Error fetching activities:", error);
            throw error;
        }
    }

    async getUserActivities(userId: string, limit = 10) {
        try {
            console.log("[ActivityLog] Fetching user activities for:", userId, "limit:", limit);

            const activities = await prisma.activityLog.findMany({
                where: { userId },
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

            console.log(activities);
            return activities;
        } catch (error) {
            console.error("[ActivityLog] Error fetching user activities:", error);
            throw error;
        }
    }

    // Debug method to check if ActivityLog table exists
    async testConnection() {
        try {
            const count = await prisma.activityLog.count();
            console.log("[ActivityLog] Table exists. Total records:", count);
            return { success: true, count };
        } catch (error) {
            console.error("[ActivityLog] Table may not exist:", error);
            return { success: false, error };
        }
    }
}

export const activityService = new ActivityService();
