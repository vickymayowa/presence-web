import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return ApiResponse.error("Email and password are required", 400);
        }

        const result = await authService.login(email, password);

        // Create response
        const response = NextResponse.json({
            success: true,
            message: result.message,
            data: {
                user: result.user
            }
        });

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
        console.log(error)
        if (process.env.NODE_ENV === 'development') {
            console.error("[Login Error]:", error);
        }

        const message = error.message || "Failed to sign in";

        if (message.includes("Invalid email or password") || message.includes("credentials")) {
            return ApiResponse.error(message, 401);
        }

        // return ApiResponse.error(message, 500);
    }
}
