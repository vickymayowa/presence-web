import { NextRequest } from "next/server";
import { leaveService } from "@/lib/services/leave-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    try {
        const leaves = await leaveService.getLeaves(session.companyId);
        return ApiResponse.success(leaves);
    } catch (error: any) {
        return ApiResponse.internalError("Failed to fetch leaves", error);
    }
}

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    try {
        const body = await req.json();
        const leave = await leaveService.requestLeave(session.id, body);
        return ApiResponse.success(leave, "Leave request submitted successfully");
    } catch (error: any) {
        return ApiResponse.internalError("Failed to submit leave request", error);
    }
}
