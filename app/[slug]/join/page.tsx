import JoinCompanyPage from "./JoinCompanyClient"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const slug = params.slug
    const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1)

    return {
        title: `Join ${capitalizedSlug}`,
        description: `Create an account and join the ${capitalizedSlug} organization on Presence.`,
    }
}

export default function Page() {
    return <JoinCompanyPage />
}
