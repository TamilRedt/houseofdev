import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { createMetadata, localBusinessJsonLd, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = createMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body className="overflow-x-clip bg-white text-slate-950 antialiased">
        <SiteShell>{children}</SiteShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </body>
    </html>
  );
}
