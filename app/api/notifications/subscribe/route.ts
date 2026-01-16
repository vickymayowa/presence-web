import { NextRequest } from "next/server";
import { notificationService } from "@/lib/services/notification-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    try {
        const subscription = await req.json();
        if (!subscription || !subscription.endpoint) {
            return ApiResponse.error("Invalid subscription data", 400);
        }

        await notificationService.subscribeToPush(session.id, subscription);
        return ApiResponse.success({ success: true }, "Subscribed successfully");
    } catch (error: any) {
        return ApiResponse.internalError("Failed to subscribe to push notifications", error);
    }
}
