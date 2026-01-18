import CheckInWindowsClient from "./CheckInWindowsClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Check-In Windows",
    description: "Configure check-in time windows for your organization",
}

export default function CheckInWindowsPage() {
    return <CheckInWindowsClient />
}
