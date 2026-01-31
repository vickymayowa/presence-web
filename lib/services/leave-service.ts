import { prisma } from "@/lib/prisma";
import { notificationService } from "./notification-service";
import { activityService } from "./activity-service";

export class LeaveService {
    async getLeaves(companyId: string) {
        return prisma.leaveRequest.findMany({
            where: {
                user: { companyId }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        department: true,
                        role: true
                    }
                },
                approver: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async requestLeave(userId: string, data: any) {
        const leave = await prisma.leaveRequest.create({
            data: {
                userId,
                type: data.type,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                reason: data.reason,
                status: 'pending'
            },
            include: {
                user: {
                    include: {
                        company: true
                    }
                }
            }
        });

        // Notify HR and CEO about new leave request
        await notificationService.broadcastNotification({
            companyId: leave.user.companyId,
            title: "New Leave Request",
            message: `${leave.user.firstName} ${leave.user.lastName} requested ${leave.type} leave from ${data.startDate} to ${data.endDate}`,
            type: 'leave',
            role: 'hr', // Primary target: HR
            actionUrl: '/dashboard/leaves'
        }).catch(e => console.error("Broadcast failed", e));

        return leave;
    }

    async updateLeaveStatus(leaveId: string, status: 'approved' | 'rejected', approverId: string) {
        const leave = await prisma.leaveRequest.update({
            where: { id: leaveId },
            data: {
                status,
                approvedBy: approverId,
                approvedAt: new Date()
            },
            include: {
                user: true
            }
        });

        // Notify the user about the status update
        await notificationService.createNotification({
            userId: leave.userId,
            title: `Leave ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `Your ${leave.type} leave request has been ${status} by management.`,
            type: 'leave',
            actionUrl: '/dashboard/leaves'
        }).catch(e => console.error("Notification failed", e));

        return leave;
    }
}

export const leaveService = new LeaveService();
