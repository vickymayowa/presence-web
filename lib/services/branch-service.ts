import { prisma } from "@/lib/prisma";
import { activityService } from "./activity-service";

export class BranchService {
    async getBranches(companyId: string) {
        return prisma.branch.findMany({
            where: { companyId },
            include: {
                _count: {
                    select: { users: true }
                }
            },
            orderBy: { name: 'asc' }
        });
    }

    async getBranch(branchId: string) {
        return prisma.branch.findUnique({
            where: { id: branchId },
            include: {
                users: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                        position: true,
                        avatar: true,
                        department: true
                    }
                }
            }
        });
    }

    async createBranch(companyId: string, creatorId: string, data: { name: string, location?: string, address?: string }) {
        const branch = await prisma.branch.create({
            data: {
                ...data,
                companyId
            }
        });

        await activityService.logActivity({
            userId: creatorId,
            companyId,
            action: "CREATE_BRANCH",
            description: `Created branch: ${data.name}`,
            metadata: { branchId: branch.id }
        });

        return branch;
    }

    async updateBranch(branchId: string, companyId: string, updaterId: string, data: { name?: string, location?: string, address?: string }) {
        const branch = await prisma.branch.update({
            where: { id: branchId },
            data
        });

        await activityService.logActivity({
            userId: updaterId,
            companyId,
            action: "UPDATE_BRANCH",
            description: `Updated branch: ${branch.name}`,
            metadata: { branchId }
        });

        return branch;
    }

    async deleteBranch(branchId: string, companyId: string, deleterId: string) {
        const branch = await prisma.branch.findUnique({
            where: { id: branchId },
            select: { name: true }
        });

        await prisma.branch.delete({
            where: { id: branchId }
        });

        await activityService.logActivity({
            userId: deleterId,
            companyId,
            action: "DELETE_BRANCH",
            description: `Deleted branch: ${branch?.name}`,
            metadata: { branchId }
        });

        return true;
    }

    async assignUserToBranch(userId: string, branchId: string | null, companyId: string, adminId: string) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { branchId }
        });

        let branchName = "None";
        if (branchId) {
            const branch = await prisma.branch.findUnique({ where: { id: branchId }, select: { name: true } });
            branchName = branch?.name || "Unknown";
        }

        await activityService.logActivity({
            userId: adminId,
            companyId,
            action: "ASSIGN_BRANCH",
            description: `Assigned ${user.firstName} ${user.lastName} to branch: ${branchName}`,
            metadata: { targetUserId: userId, branchId }
        });

        return user;
    }
}

export const branchService = new BranchService();
