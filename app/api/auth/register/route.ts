import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body || typeof body !== 'object') {
            return ApiResponse.error("Invalid request body", 400);
        }

        const result = await authService.register(body);

        // Create response
        const response = NextResponse.json({
            success: true,
            message: result.message,
            data: {
                user: result.user
            }
        }, { status: 201 });

        // Set auth cookie
        const cookieStore = await cookies();
        cookieStore.set("presence_auth_token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;

    } catch (error: any) {
        if (process.env.NODE_ENV === 'development') {
            console.error("[Registration Error]:", error);
        }

        const message = error.message || "An unexpected error occurred during registration";

        if (message.includes("already exists")) {
            return ApiResponse.error(message, 409);
        }

        if (message.includes("required") || message.includes("Missing") || message.includes("Invalid")) {
            return ApiResponse.error(message, 400);
        }

        return ApiResponse.error(message, 500);
    }
}
