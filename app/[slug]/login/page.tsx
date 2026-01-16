import CompanyLoginPage from "./CompanyLoginClient"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const capitalizedSlug =
        slug?.replace(/-/g, " ")?.replace(/\b\w/g, (c) => c.toUpperCase()) ??
        "Organization";

    return {
        title: `Login to ${capitalizedSlug}`,
        description: `Sign in to the ${capitalizedSlug} organization workspace on Presence.`,
    }
}

export default function Page() {
    return <CompanyLoginPage />
}
