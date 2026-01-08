import DashboardPage from "./DashboardClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Overview",
  description: "Your personalized Presence dashboard overview.",
}

export default function Page() {
  return <DashboardPage />
}
