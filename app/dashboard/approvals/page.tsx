import ApprovalsPage from "./ApprovalsClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Approvals",
    description: "Review and manage pending approval requests.",
}

export default function Page() {
    return <ApprovalsPage />
}
