import { NextRequest } from "next/server";
import { activityService } from "@/lib/services/activity-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "10");
        const scope = searchParams.get("scope") || "company"; // "company" or "user"

        let activities;
        if (scope === "user") {
            activities = await activityService.getUserActivities(session.id, limit);
        } else {
            activities = await activityService.getRecentActivities(session.companyId, limit);
        }

        return ApiResponse.success(activities);
    } catch (error: any) {
        return ApiResponse.internalError("Failed to fetch activities", error);
    }
}
