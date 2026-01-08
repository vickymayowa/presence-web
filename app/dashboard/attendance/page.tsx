import AttendancePage from "./AttendanceClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Attendance Records",
    description: "Track and manage employee attendance across the organization.",
}

export default function Page() {
    return <AttendancePage />
}
