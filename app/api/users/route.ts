import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export async function GET(req: NextRequest) {
    try {
        const currentUser = getSession(req);
        if (!currentUser) {
            return ApiResponse.error("Unauthorized", 401);
        }

        // Fetch all users from the same company
        const users = await prisma.user.findMany({
            where: {
                companyId: currentUser.companyId
            },
            include: {
                company: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Sanitize users (remove passwords)
        const sanitizedUsers = users.map(({ password, ...user }) => user);

        return ApiResponse.success(sanitizedUsers, "Users fetched successfully");

    } catch (error: any) {
        console.error("[Users Fetch Error]:", error);
        return ApiResponse.internalError("Failed to fetch users", error);
    }
}
