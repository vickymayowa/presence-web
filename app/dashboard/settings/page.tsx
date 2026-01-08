import SettingsPage from "./SettingsClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Settings",
    description: "Configure your personal and workspace settings.",
}

export default function Page() {
    return <SettingsPage />
}
