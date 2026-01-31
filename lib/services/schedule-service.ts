import { prisma } from "@/lib/prisma";
import { activityService } from "./activity-service";

export class ScheduleService {
    async getEvents(companyId: string, startDate?: Date, endDate?: Date) {
        const where: any = { companyId };

        if (startDate && endDate) {
            where.startTime = {
                gte: startDate,
                lte: endDate
            };
        }

        return prisma.calendarEvent.findMany({
            where,
            include: {
                organizer: {
                    select: { firstName: true, lastName: true, avatar: true }
                },
                attendees: {
                    select: { id: true, firstName: true, lastName: true, avatar: true }
                }
            },
            orderBy: { startTime: 'asc' }
        });
    }

    async createEvent(data: {
        companyId: string;
        organizerId: string;
        title: string;
        description?: string;
        startTime: Date;
        endTime: Date;
        type: string;
        mode?: 'office' | 'remote' | 'hybrid'; // Adjusted to match schema enum if needed, or mapped
        attendeeIds?: string[];
        location?: string;
        meetingLink?: string;
    }) {
        // Map mode to Prisma WorkMode enum if strictly typed
        // Schema has 'office' | 'remote' | 'hybrid'

        const event = await prisma.calendarEvent.create({
            data: {
                companyId: data.companyId,
                organizerId: data.organizerId,
                title: data.title,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime,
                type: data.type,
                mode: (data.mode as any) || 'office',
                location: data.location,
                meetingLink: data.meetingLink,
                attendees: {
                    connect: data.attendeeIds?.map(id => ({ id })) || []
                }
            }
        });

        // Log Activity
        await activityService.logActivity({
            userId: data.organizerId,
            companyId: data.companyId,
            action: "CREATE_EVENT",
            description: `Scheduled event: ${data.title}`,
            metadata: { eventId: event.id, startTime: data.startTime }
        });

        return event;
    }
}

export const scheduleService = new ScheduleService();
