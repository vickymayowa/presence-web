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
        const { id, all, title, message, type, read } = await req.json();

        if (all && read === true) {
            await notificationService.markAllAsRead(session.id);
            return ApiResponse.success({ success: true });
        }

        if (!id) return ApiResponse.error("Missing notification ID", 400);

        // Fetch notification to check ownership
        const notifications = await notificationService.getNotifications(session.id);
        const notification = notifications.find(n => n.id === id);

        if (!notification) return ApiResponse.error("Notification not found or unauthorized", 404);

        if (read !== undefined) {
            await notificationService.markAsRead(id);
        } else {
            // Edit functionality - restrict to CEO/HR if it's an announcement?
            // For now, let's allow anyone to edit their own notifications (e.g. for testing)
            // but in a real app we might restrict editing to broadcasts by the sender.
            if (session.role !== 'ceo' && session.role !== 'hr') {
                return ApiResponse.error("Only management can edit sent signals", 403);
            }
            await notificationService.updateNotification(id, { title, message, type });
        }

        return ApiResponse.success({ success: true });
    } catch (error: any) {
        return ApiResponse.internalError("Failed to update notification", error);
    }
}

export async function DELETE(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const all = searchParams.get("all") === "true";

        if (all) {
            await notificationService.deleteAllNotifications(session.id);
        } else if (id) {
            // Verify ownership before deleting
            const notifications = await notificationService.getNotifications(session.id);
            if (!notifications.some(n => n.id === id)) {
                return ApiResponse.unauthorized("Cannot delete notification you do not own");
            }
            await notificationService.deleteNotification(id);
        } else {
            return ApiResponse.error("ID or 'all' parameter required", 400);
        }

        return ApiResponse.success({ success: true });
    } catch (error: any) {
        return ApiResponse.internalError("Failed to delete notification", error);
    }
}
