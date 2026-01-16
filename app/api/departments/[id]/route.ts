import { NextRequest } from "next/server";
import { departmentService } from "@/lib/services/department-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    if (session.role !== 'ceo' && session.role !== 'hr') {
        return ApiResponse.error("Forbidden: Only CEO and HR can update departments", 403);
    }

    try {
        const body = await req.json();
        const department = await departmentService.updateDepartment(params.id, body);
        return ApiResponse.success(department);
    } catch (error: any) {
        return ApiResponse.internalError("Failed to update department", error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    if (session.role !== 'ceo' && session.role !== 'hr') {
        return ApiResponse.error("Forbidden: Only CEO and HR can delete departments", 403);
    }

    try {
        await departmentService.deleteDepartment(params.id);
        return ApiResponse.success({ message: "Department deleted successfully" });
    } catch (error: any) {
        return ApiResponse.internalError("Failed to delete department", error);
    }
}
