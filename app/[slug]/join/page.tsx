import JoinCompanyPage from "./JoinCompanyClient";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  console.log("Resolved params:", resolvedParams); // Debug log

  const slug = resolvedParams?.slug || "Organization"; // Safe fallback
  const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
  console.log("Capitalized Slug:", capitalizedSlug); // Debug log

  return {
    title: `Join ${capitalizedSlug}`,
    description: `Create an account and join the ${capitalizedSlug} organization on Presence.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  console.log("Page params:", resolvedParams); // Debug log

  const slug = resolvedParams?.slug || "";

  return <JoinCompanyPage slug={slug} />;
}
