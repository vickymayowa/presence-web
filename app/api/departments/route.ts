import { NextRequest } from "next/server";
import { departmentService } from "@/lib/services/department-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    try {
        const departments = await departmentService.getDepartments(session.companyId);
        return ApiResponse.success(departments);
    } catch (error: any) {
        return ApiResponse.internalError("Failed to fetch departments", error);
    }
}

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    // Access control: Only CEO and HR can create departments
    if (session.role !== 'ceo' && session.role !== 'hr') {
        return ApiResponse.error("Forbidden: Only CEO and HR can create departments", 403);
    }

    try {
        const body = await req.json();
        const department = await departmentService.createDepartment({
            ...body,
            companyId: session.companyId
        });
        return ApiResponse.success(department);
    } catch (error: any) {
        return ApiResponse.internalError("Failed to create department", error);
    }
}
