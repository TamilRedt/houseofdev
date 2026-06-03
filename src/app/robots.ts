import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal", "/employee-portal", "/admin-dashboard", "/update-password"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

