import CompanyLoginPage from "./CompanyLoginClient"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const slug = params.slug
    const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1)

    return {
        title: `Login to ${capitalizedSlug}`,
        description: `Sign in to the ${capitalizedSlug} organization workspace on Presence.`,
    }
}

export default function Page() {
    return <CompanyLoginPage />
}
