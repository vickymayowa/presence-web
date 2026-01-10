import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/utils/api-response";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!

// Helper to extract user from token
function getUserFromToken(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded;
    } catch {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const currentUser = getUserFromToken(req);

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
