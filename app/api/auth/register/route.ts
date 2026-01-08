import { NextRequest } from "next/server";
import { authService } from "@/lib/services/auth-service";
import { ApiResponse } from "@/lib/utils/api-response";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Basic request structure validation
        if (!body || typeof body !== 'object') {
            return ApiResponse.error("Invalid request body", 400);
        }

        // The authService handles the core business logic and validations.
        // It returns formatted data or throws meaningful errors.
        const result = await authService.register(body);

        // Standardized success response matching our ApiResponse utility.
        return ApiResponse.success(
            {
                user: result.user,
                token: result.token
            },
            result.message,
            201
        );

    } catch (error: any) {
        // Log error for internal monitoring (development)
        if (process.env.NODE_ENV === 'development') {
            console.error("[Registration Error]:", error);
        }

        const message = error.message || "An unexpected error occurred during registration";

        // Map specific business errors to HTTP status codes
        if (message.includes("already exists")) {
            return ApiResponse.error(message, 409);
        }

        if (message.includes("required") || message.includes("Missing") || message.includes("Invalid")) {
            return ApiResponse.error(message, 400);
        }

        // Generic fallback for unhandled server-side exceptions
        return ApiResponse.internalError("Registration failed on server", error);
    }
}
