import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/auth-service";
import { getSession } from "@/lib/utils/auth-utils";

export async function GET(req: NextRequest) {
    const session = getSession(req);

    if (!session) {
        return NextResponse.json({ success: false, message: "No active session" }, { status: 401 });
    }

    try {
        const isValid = await authService.verifySession(session.id, session.sessionId);

        if (!isValid) {
            return NextResponse.json({ success: false, message: "Session expired or logged in elsewhere" });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Session verification failed" }, { status: 500 });
    }
}
