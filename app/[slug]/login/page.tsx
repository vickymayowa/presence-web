import CompanyLoginPage from "./CompanyLoginClient"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
const capitalizedSlug =
  params?.slug?.replace(/-/g, " ")?.replace(/\b\w/g, (c) => c.toUpperCase()) ??
  "Organization";

    return {
        title: `Login to ${capitalizedSlug}`,
        description: `Sign in to the ${capitalizedSlug} organization workspace on Presence.`,
    }
}

export default function Page() {
    return <CompanyLoginPage />
}
