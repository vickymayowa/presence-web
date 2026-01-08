import { NextResponse } from "next/server";

export class ApiResponse {
    static success(data: any, message: string = "Success", status: number = 200) {
        return NextResponse.json(
            {
                success: true,
                message,
                data,
            },
            { status }
        );
    }

    static error(message: string = "An error occurred", status: number = 400, errors: any = null) {
        return NextResponse.json(
            {
                success: false,
                message,
                errors,
            },
            { status }
        );
    }

    static unauthorized(message: string = "Unauthorized") {
        return this.error(message, 401);
    }

    static forbidden(message: string = "Forbidden") {
        return this.error(message, 403);
    }

    static notFound(message: string = "Resource not found") {
        return this.error(message, 404);
    }

    static internalError(message: string = "Internal server error", error: any = null) {
        process.env.NODE_ENV === "development" && console.error(error);
        return this.error(message, 500);
    }
}
