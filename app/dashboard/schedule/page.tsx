import SchedulePage from "./ScheduleClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Schedule",
    description: "View and manage your work schedule and upcoming events.",
}

export default function Page() {
    return <SchedulePage />
}
