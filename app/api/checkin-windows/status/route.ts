import { NextRequest, NextResponse } from "next/server";
import { checkInWindowService } from "@/lib/services/checkin-window-service";
import { getSession } from "@/lib/utils/auth-utils";
import { ApiResponse } from "@/lib/utils/api-response";

export const dynamic = "force-dynamic";

/**
 * GET: Check if check-in is currently allowed for the user's company
 */
export async function GET(req: NextRequest) {
    const session = getSession(req);

    if (!session) {
        return ApiResponse.unauthorized("Authentication required");
    }

    try {
        const result = await checkInWindowService.isCheckInAllowed(session.companyId);

        return ApiResponse.success(result, result.allowed ? "Check-in is allowed" : "Check-in is not allowed");
    } catch (error: any) {
        console.error("[CheckInStatus GET]", error);
        return ApiResponse.internalError("Failed to check check-in status", error);
    }
}
