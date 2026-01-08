import ReportsPage from "./ReportsClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Reports & Analytics",
    description: "Generate and view detailed reports on attendance and performance.",
}

export default function Page() {
    return <ReportsPage />
}
