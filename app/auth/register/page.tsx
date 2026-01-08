import RegisterPage from "./RegisterClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Create Account",
    description: "Join Presence today and start managing your team's attendance with ease.",
}

export default function Page() {
    return <RegisterPage />
}