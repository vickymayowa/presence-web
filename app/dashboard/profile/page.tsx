import ProfilePage from "./ProfileClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Profile",
    description: "Manage your account settings and preferences on Presence.",
}

export default function Page() {
    return <ProfilePage />
}
