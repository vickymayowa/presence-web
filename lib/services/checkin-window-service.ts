import { prisma } from "@/lib/prisma";

export interface CheckInWindowDTO {
    name: string;
    description?: string;
    startTime: string; // Format: "HH:mm"
    endTime: string;   // Format: "HH:mm"
    daysOfWeek: number[]; // Array of day numbers: 0=Sunday, 1=Monday, etc.
    isActive?: boolean;
}

export class CheckInWindowService {
    /**
     * Create a new check-in window configuration
     */
    async createWindow(companyId: string, data: CheckInWindowDTO) {
        const { name, description, startTime, endTime, daysOfWeek, isActive = true } = data;

        // Validate time format
        if (!this.isValidTimeFormat(startTime) || !this.isValidTimeFormat(endTime)) {
            throw new Error("Invalid time format. Use HH:mm format (e.g., '07:30')");
        }

        // Validate that end time is after start time
        if (!this.isEndTimeAfterStartTime(startTime, endTime)) {
            throw new Error("End time must be after start time");
        }

        const window = await prisma.checkInWindow.create({
            data: {
                companyId,
                name,
                description,
                startTime,
                endTime,
                daysOfWeek: daysOfWeek.join(','),
                isActive,
            },
        });

        return window;
    }

    /**
     * Get all check-in windows for a company
     */
    async getCompanyWindows(companyId: string, activeOnly: boolean = false) {
        const windows = await prisma.checkInWindow.findMany({
            where: {
                companyId,
                ...(activeOnly && { isActive: true }),
            },
            orderBy: {
                startTime: 'asc',
            },
        });

        return windows.map(window => ({
            ...window,
            daysOfWeek: window.daysOfWeek.split(',').map(Number),
        }));
    }

    /**
     * Update a check-in window
     */
    async updateWindow(windowId: string, data: Partial<CheckInWindowDTO>) {
        const updateData: any = {};

        if (data.name) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.startTime) {
            if (!this.isValidTimeFormat(data.startTime)) {
                throw new Error("Invalid start time format");
            }
            updateData.startTime = data.startTime;
        }
        if (data.endTime) {
            if (!this.isValidTimeFormat(data.endTime)) {
                throw new Error("Invalid end time format");
            }
            updateData.endTime = data.endTime;
        }
        if (data.daysOfWeek) {
            updateData.daysOfWeek = data.daysOfWeek.join(',');
        }
        if (data.isActive !== undefined) {
            updateData.isActive = data.isActive;
        }

        const window = await prisma.checkInWindow.update({
            where: { id: windowId },
            data: updateData,
        });

        return {
            ...window,
            daysOfWeek: window.daysOfWeek.split(',').map(Number),
        };
    }

    /**
     * Delete a check-in window
     */
    async deleteWindow(windowId: string) {
        await prisma.checkInWindow.delete({
            where: { id: windowId },
        });
    }

    /**
     * Check if current time is within any active check-in window
     */
    async isCheckInAllowed(companyId: string): Promise<{ allowed: boolean; reason?: string; activeWindow?: any }> {
        const now = new Date();
        const currentDay = now.getDay(); // 0=Sunday, 1=Monday, etc.
        const currentTime = this.formatTime(now);

        const activeWindows = await this.getCompanyWindows(companyId, true);

        for (const window of activeWindows) {
            // Check if current day is in the allowed days
            if (!window.daysOfWeek.includes(currentDay)) {
                continue;
            }

            // Check if current time is within the window
            if (this.isTimeInRange(currentTime, window.startTime, window.endTime)) {
                return {
                    allowed: true,
                    activeWindow: window,
                };
            }
        }

        // No active window found
        const nextWindow = this.findNextWindow(activeWindows, currentDay, currentTime);

        return {
            allowed: false,
            reason: nextWindow
                ? `Check-in is currently closed. Next window: ${nextWindow.name} (${nextWindow.startTime} - ${nextWindow.endTime})`
                : "No active check-in windows configured for today",
        };
    }

    /**
     * Helper: Validate time format (HH:mm)
     */
    private isValidTimeFormat(time: string): boolean {
        const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
    }

    /**
     * Helper: Check if end time is after start time
     */
    private isEndTimeAfterStartTime(startTime: string, endTime: string): boolean {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        return endMinutes > startMinutes;
    }

    /**
     * Helper: Format Date to HH:mm
     */
    private formatTime(date: Date): string {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    /**
     * Helper: Check if time is in range
     */
    private isTimeInRange(currentTime: string, startTime: string, endTime: string): boolean {
        const [currentHour, currentMin] = currentTime.split(':').map(Number);
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        const currentMinutes = currentHour * 60 + currentMin;
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    }

    /**
     * Helper: Find next available check-in window
     */
    private findNextWindow(windows: any[], currentDay: number, currentTime: string) {
        // First, check for windows later today
        const todayWindows = windows.filter(w =>
            w.daysOfWeek.includes(currentDay) && w.startTime > currentTime
        );

        if (todayWindows.length > 0) {
            return todayWindows[0];
        }

        // Then check for windows on upcoming days
        for (let i = 1; i <= 7; i++) {
            const nextDay = (currentDay + i) % 7;
            const nextDayWindows = windows.filter(w => w.daysOfWeek.includes(nextDay));

            if (nextDayWindows.length > 0) {
                return nextDayWindows[0];
            }
        }

        return null;
    }
}

export const checkInWindowService = new CheckInWindowService();
