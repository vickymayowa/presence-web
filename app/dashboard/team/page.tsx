import TeamPage from "./TeamClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Team Overview",
    description: "View and manage your team members and their roles.",
}

export default function Page() {
    return <TeamPage />
}
