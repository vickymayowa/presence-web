import LeavesPage from "./LeavesClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Leave Management",
    description: "View and manage employee leave requests and balances.",
}

export default function Page() {
    return <LeavesPage />
}
