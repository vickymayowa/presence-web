import EmployeesPage from "./EmployeesClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Employee Directory",
    description: "View and manage all employees within the organization.",
}

export default function Page() {
    return <EmployeesPage />
}
