import type { Metadata } from "next";
import { absoluteUrl, siteUrl } from "@/lib/utils";

const brandName = "House Of Dev";
const faviconPath = "/favicon-v2.svg";
const brandLogoPath = "/brand/houseofdev-logo-horizontal.svg";
const defaultTitle = "House Of Dev | Websites & AI Automation for Local Businesses";
const defaultDescription =
  "House Of Dev helps local businesses move online and grow through professional websites, dashboards, booking systems, business automation, and AI-powered workflows.";

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
  const pageTitle = title ? `${title} | ${brandName}` : defaultTitle;
  const url = absoluteUrl(path);

  return {
    metadataBase: new URL(siteUrl),
    applicationName: brandName,
    title: pageTitle,
    description,
    keywords: [
      "House Of Dev",
      "HouseOfDev",
      "website development for local businesses",
      "AI automation services",
      "business websites in Hosur",
      "web development in Bengaluru",
      ...keywords,
    ],
    authors: [{ name: brandName, url: absoluteUrl("/") }],
    creator: brandName,
    publisher: brandName,
    category: "Technology",
    alternates: {
      canonical: url,
    },
    icons: {
      icon: [{ url: faviconPath, type: "image/svg+xml", sizes: "any" }],
      shortcut: [faviconPath],
      apple: [{ url: faviconPath, type: "image/svg+xml", sizes: "512x512" }],
    },
    manifest: "/manifest.webmanifest",
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: brandName,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: absoluteUrl(image),
          width: 1200,
          height: 630,
          alt: "House Of Dev — Local Business Transition, Growth, Value",
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
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

const brandLogo = {
  "@type": "ImageObject",
  url: absoluteUrl(brandLogoPath),
  contentUrl: absoluteUrl(brandLogoPath),
  width: 920,
  height: 321,
  caption: "House Of Dev logo",
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: brandName,
  alternateName: "HouseOfDev",
  url: `${siteUrl}/`,
  logo: brandLogo,
  image: brandLogo,
  slogan: "Local Business Transition | Growth | Value",
  description: defaultDescription,
  email: "mailto:arasanredt@gmail.com",
  telephone: "+91-88384-01597",
  areaServed: ["Hosur", "Bengaluru", "Tamil Nadu", "Karnataka", "India"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-88384-01597",
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["English", "Tamil"],
    },
  ],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: brandName,
  alternateName: "HouseOfDev",
  url: `${siteUrl}/`,
  publisher: {
    "@id": `${siteUrl}/#organization`,
  },
};

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/#professional-service`,
  name: brandName,
  alternateName: "HouseOfDev",
  description: defaultDescription,
  areaServed: ["Hosur", "Bengaluru", "Tamil Nadu", "Karnataka", "India"],
  priceRange: "INR 4,999+",
  url: `${siteUrl}/`,
  logo: brandLogo,
  image: brandLogo,
  telephone: "+91-88384-01597",
  email: "mailto:arasanredt@gmail.com",
  parentOrganization: {
    "@id": `${siteUrl}/#organization`,
  },
};
