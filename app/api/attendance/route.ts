import { NextRequest } from "next/server";
import { attendanceService } from "@/lib/services/attendance-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const userId = searchParams.get('userId');

    const filters: any = {};
    if (date && date !== 'undefined') filters.date = new Date(date);
    if (start && start !== 'undefined') filters.startDate = new Date(start);
    if (end && end !== 'undefined') filters.endDate = new Date(end);
    if (userId && userId !== 'undefined') filters.userId = userId;

    try {
        const records = await attendanceService.getAttendanceRecords(session.companyId, filters);
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
