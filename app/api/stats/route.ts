import { NextRequest } from "next/server";
import { companyService } from "@/lib/services/company-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export async function GET(req: NextRequest) {
    const session = getSession(req);

    if (!session) {
        return ApiResponse.unauthorized();
    }

    try {
        const stats = await companyService.getCompanyStats(session.companyId);
        return ApiResponse.success(stats);
    } catch (error: any) {
        return ApiResponse.internalError("Failed to fetch statistics", error);
    }
}
