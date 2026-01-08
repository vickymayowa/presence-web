import { NextRequest } from "next/server";
import { authService } from "@/lib/services/auth-service";
import { ApiResponse } from "@/lib/utils/api-response";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return ApiResponse.error("Email and password are required", 400);
        }

        const result = await authService.login(email, password);

        // Standardized success response
        return ApiResponse.success(
            {
                user: result.user,
                token: result.token
            },
            result.message,
            200
        );

    } catch (error: any) {
        if (process.env.NODE_ENV === 'development') {
            console.error("[Login Error]:", error);
        }

        const message = error.message || "Failed to sign in";

        // Return 401 for authentication failures
        if (message.includes("Invalid email or password") || message.includes("credentials")) {
            return ApiResponse.error(message, 401);
        }

        return ApiResponse.internalError("Authentication failed", error);
    }
}
