import BranchesPage from "./BranchesClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Company Branches",
    description: "Manage your physical office locations and staff assignments.",
}

export default function Page() {
    return <BranchesPage />
}
