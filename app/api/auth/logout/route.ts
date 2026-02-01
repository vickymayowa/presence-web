import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authService } from "@/lib/services/auth-service";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const tokenToken = cookieStore.get("presence_auth_token")?.value;

        if (tokenToken) {
            const decoded = authService.verifyToken(tokenToken);
            if (decoded && decoded.id) {
                await authService.logout(decoded.id);
            }
        }

        // Clear the cookie regardless
        cookieStore.delete("presence_auth_token");

        return NextResponse.json({
            success: true,
            message: "Logged out successfully and session invalidated"
        });
    } catch (error) {
        console.error("[Logout Route Error]:", error);
        // Still try to clear the cookie and return a success message
        // since the user wants to be logged out anyway
        const cookieStore = await cookies();
        cookieStore.delete("presence_auth_token");

        return NextResponse.json({
            success: true,
            message: "Logged out successfully (with minor issues during session cleanup)"
        });
    }
}
