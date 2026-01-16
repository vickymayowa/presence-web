import { NextRequest } from "next/server";
import { notificationService } from "@/lib/services/notification-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    // Access control: Only CEO and HR can broadcast
    if (session.role !== 'ceo' && session.role !== 'hr') {
        return ApiResponse.error("Forbidden: Only management can broadcast updates", 403);
    }

    try {
        const { title, message, type, role, actionUrl } = await req.json();

        if (!title || !message || !type) {
            return ApiResponse.error("Missing required fields", 400);
        }

        await notificationService.broadcastNotification({
            companyId: session.companyId,
            title,
            message,
            type,
            role,
            actionUrl: actionUrl || "/dashboard"
        });

        return ApiResponse.success({ success: true }, "Broadcast sent successfully");
    } catch (error: any) {
        return ApiResponse.internalError("Failed to send broadcast", error);
    }
}
