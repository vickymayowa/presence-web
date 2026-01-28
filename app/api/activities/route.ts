import { NextRequest } from "next/server";
import { activityService } from "@/lib/services/activity-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        console.log("[Activities API] Unauthorized request");
        return ApiResponse.unauthorized();
    }

    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "10");
        const scope = searchParams.get("scope") || "company"; // "company" or "user"

        console.log("[Activities API] Request:", {
            scope,
            limit,
            userId: session.id,
            companyId: session.companyId
        });

        let activities;
        if (scope === "user") {
            activities = await activityService.getUserActivities(session.id, limit);
        } else {
            activities = await activityService.getRecentActivities(session.companyId, limit);
        }

        console.log("[Activities API] Response:", {
            scope,
            count: activities.length,
            firstActivity: activities[0] ? {
                id: activities[0].id,
                action: activities[0].action,
                createdAt: activities[0].createdAt
            } : null
        });

        return ApiResponse.success(activities);
    } catch (error: any) {
        console.error("[Activities API] Error:", error);
        return ApiResponse.internalError("Failed to fetch activities", error);
    }
}
