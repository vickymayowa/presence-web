import { NextRequest, NextResponse } from "next/server";
import { checkInWindowService } from "@/lib/services/checkin-window-service";
import { getSession } from "@/lib/utils/auth-utils";
import { ApiResponse } from "@/lib/utils/api-response";

export const dynamic = "force-dynamic";

/**
 * GET: Fetch all check-in windows for the user's company
 */
export async function GET(req: NextRequest) {
    const session = getSession(req);

    if (!session) {
        return ApiResponse.unauthorized("Authentication required");
    }

    try {
        const { searchParams } = new URL(req.url);
        const activeOnly = searchParams.get("activeOnly") === "true";

        const windows = await checkInWindowService.getCompanyWindows(session.companyId, activeOnly);

        return ApiResponse.success({ windows }, "Check-in windows retrieved successfully");
    } catch (error: any) {
        console.error("[CheckInWindows GET]", error);
        return ApiResponse.internalError("Failed to fetch check-in windows", error);
    }
}

/**
 * POST: Create a new check-in window (CEO/HR only)
 */
export async function POST(req: NextRequest) {
    const session = getSession(req);

    if (!session) {
        return ApiResponse.unauthorized("Authentication required");
    }

    // Only CEO and HR can create check-in windows
    if (session.role !== "ceo" && session.role !== "hr") {
        return ApiResponse.forbidden("Only CEO and HR can configure check-in windows");
    }

    try {
        const body = await req.json();
        const { name, description, startTime, endTime, daysOfWeek, isActive } = body;

        if (!name || !startTime || !endTime || !daysOfWeek) {
            return ApiResponse.error("Missing required fields: name, startTime, endTime, daysOfWeek");
        }

        const window = await checkInWindowService.createWindow(session.companyId, {
            name,
            description,
            startTime,
            endTime,
            daysOfWeek,
            isActive,
        });

        return ApiResponse.success({ window }, "Check-in window created successfully", 201);
    } catch (error: any) {
        console.log(error)
        console.error("[CheckInWindows POST]", error);
        return ApiResponse.internalError("Failed to create check-in window", error);
    }
}

/**
 * PATCH: Update a check-in window (CEO/HR only)
 */
export async function PATCH(req: NextRequest) {
    const session = getSession(req);

    if (!session) {
        return ApiResponse.unauthorized("Authentication required");
    }

    // Only CEO and HR can update check-in windows
    if (session.role !== "ceo" && session.role !== "hr") {
        return ApiResponse.forbidden("Only CEO and HR can configure check-in windows");
    }

    try {
        const body = await req.json();
        const { windowId, ...updateData } = body;

        if (!windowId) {
            return ApiResponse.error("Window ID is required");
        }

        const window = await checkInWindowService.updateWindow(windowId, updateData);

        return ApiResponse.success({ window }, "Check-in window updated successfully");
    } catch (error: any) {
        console.error("[CheckInWindows PATCH]", error);
        return ApiResponse.internalError("Failed to update check-in window", error);
    }
}

/**
 * DELETE: Delete a check-in window (CEO/HR only)
 */
export async function DELETE(req: NextRequest) {
    const session = getSession(req);

    if (!session) {
        return ApiResponse.unauthorized("Authentication required");
    }

    // Only CEO and HR can delete check-in windows
    if (session.role !== "ceo" && session.role !== "hr") {
        return ApiResponse.forbidden("Only CEO and HR can configure check-in windows");
    }

    try {
        const { searchParams } = new URL(req.url);
        const windowId = searchParams.get("windowId");

        if (!windowId) {
            return ApiResponse.error("Window ID is required");
        }

        await checkInWindowService.deleteWindow(windowId);

        return ApiResponse.success({}, "Check-in window deleted successfully");
    } catch (error: any) {
        console.error("[CheckInWindows DELETE]", error);
        return ApiResponse.internalError("Failed to delete check-in window", error);
    }
}
