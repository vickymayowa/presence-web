import { NextRequest } from "next/server";
import { activityService } from "@/lib/services/activity-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    try {
        // Test 1: Check if ActivityLog table exists
        const tableTest = await activityService.testConnection();

        // Test 2: Try to create a test activity
        const testActivity = await activityService.logActivity({
            userId: session.id,
            companyId: session.companyId,
            action: "DEBUG_TEST",
            description: "Debug test activity",
            metadata: { test: true, timestamp: new Date().toISOString() }
        });

        // Test 3: Count total activities
        const totalCount = await prisma.activityLog.count();
        const companyCount = await prisma.activityLog.count({
            where: { companyId: session.companyId }
        });
        const userCount = await prisma.activityLog.count({
            where: { userId: session.id }
        });

        // Test 4: Get recent activities
        const recentActivities = await activityService.getRecentActivities(session.companyId, 5);

        return ApiResponse.success({
            message: "Activity log debug information",
            tests: {
                tableExists: tableTest,
                testActivityCreated: !!testActivity,
                testActivityId: testActivity?.id,
                counts: {
                    total: totalCount,
                    company: companyCount,
                    user: userCount
                },
                recentActivities: recentActivities.map(a => ({
                    id: a.id,
                    action: a.action,
                    description: a.description,
                    createdAt: a.createdAt,
                    user: a.user ? `${a.user.firstName} ${a.user.lastName}` : 'Unknown'
                }))
            },
            session: {
                userId: session.id,
                companyId: session.companyId,
                role: session.role
            }
        });
    } catch (error: any) {
        return ApiResponse.internalError("Debug test failed", error);
    }
}
