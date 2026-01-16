import { NextRequest } from "next/server";
import { leaveService } from "@/lib/services/leave-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    // Only HR or CEO or indirect manager can approve leaves
    if (session.role === 'staff') {
        return ApiResponse.error("Forbidden: Staff cannot approve leaves", 403);
    }

    try {
        const { status } = await req.json();
        if (status !== 'approved' && status !== 'rejected') {
            return ApiResponse.error("Invalid status", 400);
        }

        const leave = await leaveService.updateLeaveStatus(params.id, status, session.id);
        return ApiResponse.success(leave, `Leave request ${status}`);
    } catch (error: any) {
        return ApiResponse.internalError("Failed to update leave status", error);
    }
}
