import { prisma } from "@/lib/prisma";
import { notificationService } from "./notification-service";
import { activityService } from "./activity-service";

export class AttendanceService {
    /**
     * Get all attendance records for a company.
     */
    /**
     * Get all attendance records for a company with optional filters.
     */
    async getAttendanceRecords(companyId: string, filters?: { date?: Date, startDate?: Date, endDate?: Date, userId?: string }) {
        const where: any = {
            user: { companyId }
        };

        if (filters?.userId) {
            where.userId = filters.userId;
        }

        if (filters?.date) {
            const start = new Date(filters.date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(filters.date);
            end.setHours(23, 59, 59, 999);
            where.date = {
                gte: start,
                lte: end
            };
        } else if (filters?.startDate && filters?.endDate) {
            const start = new Date(filters.startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(filters.endDate);
            end.setHours(23, 59, 59, 999);
            where.date = {
                gte: start,
                lte: end
            };
        }

        return prisma.attendanceRecord.findMany({
            where,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        department: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        });
    }

    /**
     * Record a check-in or check-out.
     */
    async logAttendance(userId: string, data: any) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { type, workMode, verificationMethod, notes, location } = data;

        // Get user for companyId
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { companyId: true, firstName: true, lastName: true }
        });

        if (!user) throw new Error("User not found");

        if (type === 'in') {
            const record = await prisma.attendanceRecord.upsert({
                where: {
                    userId_date: { userId, date: today }
                },
                update: {
                    checkIn: new Date(),
                    status: 'present',
                    workMode,
                    verificationMethod,
                    location
                },
                create: {
                    userId,
                    date: today,
                    checkIn: new Date(),
                    status: 'present',
                    workMode,
                    verificationMethod,
                    location
                }
            });

            // Trigger notification
            await notificationService.createNotification({
                userId,
                title: "Check-in Confirmed",
                message: `You successfully checked in at ${new Date().toLocaleTimeString()} (${workMode})`,
                type: 'attendance',
                actionUrl: '/dashboard/attendance'
            }).catch(e => console.error("Notification failed", e));

            // Log Activity
            await activityService.logActivity({
                userId,
                companyId: user.companyId,
                action: "CHECK_IN",
                description: `${user.firstName} ${user.lastName} checked in via ${workMode}`,
                metadata: { workMode, verificationMethod }
            });

            return record;
        } else {
            const record = await prisma.attendanceRecord.update({
                where: {
                    userId_date: { userId, date: today }
                },
                data: {
                    checkOut: new Date(),
                    notes
                }
            });

            // Trigger notification
            await notificationService.createNotification({
                userId,
                title: "Check-out Logged",
                message: `You checked out at ${new Date().toLocaleTimeString()}`,
                type: 'attendance',
                actionUrl: '/dashboard/attendance'
            }).catch(e => console.error("Notification failed", e));

            // Log Activity
            await activityService.logActivity({
                userId,
                companyId: user.companyId,
                action: "CHECK_OUT",
                description: `${user.firstName} ${user.lastName} checked out`,
                metadata: { notes }
            });

            return record;
        }
    }
}

export const attendanceService = new AttendanceService();
