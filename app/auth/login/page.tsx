import LoginPage from "./LoginClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Login",
    description: "Sign in to your Presence account to manage your workspace and attendance.",
}

export default function Page() {
    return <LoginPage />
}
