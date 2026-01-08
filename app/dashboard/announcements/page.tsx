import AnnouncementsPage from "./AnnouncementsClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Announcements",
    description: "Send push notifications and alerts to your team members.",
}

export default function Page() {
    return <AnnouncementsPage />
}
