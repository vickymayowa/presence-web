import { NextResponse } from "next/server";
import { seedService } from "@/lib/services/seed-service";
import { ApiResponse } from "@/lib/utils/api-response";

export async function GET() {
    try {
        // Only allow seeding in development for security
        if (process.env.NODE_ENV === "production" && !process.env.ALLOW_SEED) {
            return ApiResponse.forbidden("Seeding is disabled in production");
        }

        const result = await seedService.seed();
        return ApiResponse.success(result, "Database populated with mock data");
    } catch (error: any) {
        return ApiResponse.internalError("Seeding failed", error);
    }
}
