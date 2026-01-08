import { NextRequest } from "next/server";
import { attendanceService } from "@/lib/services/attendance-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    try {
        const records = await attendanceService.getAttendanceRecords(session.companyId);
        return ApiResponse.success(records);
    } catch (error: any) {
        return ApiResponse.internalError("Failed to fetch attendance", error);
    }
}

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    try {
        const body = await req.json();
        const record = await attendanceService.logAttendance(session.id, body);
        return ApiResponse.success(record, "Attendance logged successfully");
    } catch (error: any) {
        return ApiResponse.internalError("Failed to log attendance", error);
    }
}
