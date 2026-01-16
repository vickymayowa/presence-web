import { NextRequest } from "next/server";
import { notificationService } from "@/lib/services/notification-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    try {
        const notifications = await notificationService.getNotifications(session.id);
        return ApiResponse.success(notifications);
    } catch (error: any) {
        return ApiResponse.internalError("Failed to fetch notifications", error);
    }
}

export async function PATCH(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    try {
        const { id, all } = await req.json();
        if (all) {
            await notificationService.markAllAsRead(session.id);
        } else if (id) {
            await notificationService.markAsRead(id);
        }
        return ApiResponse.success({ success: true });
    } catch (error: any) {
        return ApiResponse.internalError("Failed to update notifications", error);
    }
}
