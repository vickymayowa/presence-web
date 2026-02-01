import { NextRequest } from "next/server";
import { announcementService } from "@/lib/services/announcement-service";
import { ApiResponse } from "@/lib/utils/api-response";
import { getSession } from "@/lib/utils/auth-utils";

export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    try {
        const announcements = await announcementService.getAnnouncements(session.companyId);
        return ApiResponse.success(announcements);
    } catch (error: any) {
        return ApiResponse.internalError("Failed to fetch announcements", error);
    }
}

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return ApiResponse.unauthorized();

    // Only CEO and HR can post announcements
    if (session.role !== 'ceo' && session.role !== 'hr') {
        return ApiResponse.forbidden("Only CEO or HR can post announcements");
    }

    try {
        const body = await req.json();
        const announcement = await announcementService.createAnnouncement(session.companyId, session.id, body);
        return ApiResponse.success(announcement, "Announcement posted successfully");
    } catch (error: any) {
        return ApiResponse.internalError("Failed to post announcement", error);
    }
}
