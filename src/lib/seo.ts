import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

const defaultTitle = "HouseOfDev - Premium Digital Agency in India";
const defaultDescription =
  "HouseOfDev builds premium websites, web applications, AI automation, cloud systems, SEO, branding, and digital transformation solutions for growing businesses.";

export function createMetadata({
  title,
  description = defaultDescription,
  path = "/",
  image = "/og",
  keywords = [],
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
} = {}): Metadata {
  const pageTitle = title ? `${title} | HouseOfDev` : defaultTitle;
  const url = absoluteUrl(path);

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.houseofdev.online",
    ),
    title: pageTitle,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: "HouseOfDev",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: absoluteUrl(image),
          width: 1200,
          height: 630,
          alt: "HouseOfDev premium digital agency",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [absoluteUrl(image)],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HouseOfDev",
  url: "https://www.houseofdev.online",
  logo: "https://www.houseofdev.online/icon.png",
  slogan: "Transforming Businesses Into Powerful Digital Brands",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["English", "Tamil"],
    },
  ],
};

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "HouseOfDev",
  description:
    "Website development, web applications, AI automation, cloud services, SEO, and digital transformation for local businesses and enterprises.",
  areaServed: ["Hosur", "Bangalore", "India"],
  priceRange: "INR 4,999+",
  url: "https://www.houseofdev.online",
};
