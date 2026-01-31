import { NextRequest } from "next/server";
import { scheduleService } from "@/lib/services/schedule-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    try {
        const events = await scheduleService.getEvents(
            session.companyId,
            start ? new Date(start) : undefined,
            end ? new Date(end) : undefined
        );
        return ApiResponse.success(events);
    } catch (error: any) {
        return ApiResponse.internalError("Failed to fetch events", error);
    }
}

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    try {
        const body = await req.json();

        // Basic validation
        if (!body.title || !body.startTime || !body.endTime) {
            return ApiResponse.error("Missing required fields", 400);
        }

        const event = await scheduleService.createEvent({
            ...body,
            companyId: session.companyId,
            organizerId: session.id,
            startTime: new Date(body.startTime),
            endTime: new Date(body.endTime)
        });

        return ApiResponse.success(event, "Event created successfully", 201);
    } catch (error: any) {
        return ApiResponse.internalError("Failed to create event", error);
    }
}
