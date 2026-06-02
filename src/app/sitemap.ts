import type { MetadataRoute } from "next";
import { blogPosts, industries, portfolioProjects, services, solutions } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/services",
    "/industries",
    "/solutions",
    "/portfolio",
    "/pricing",
    "/about",
    "/careers",
    "/blog",
    "/contact",
    "/portal",
    "/employee-portal",
    "/admin-dashboard",
  ];

  const dynamicRoutes = [
    ...services.map((item) => `/services/${item.slug}`),
    ...industries.map((item) => `/industries/${item.slug}`),
    ...solutions.map((item) => `/solutions/${item.slug}`),
    ...portfolioProjects.map((item) => `/portfolio/${item.slug}`),
    ...blogPosts.map((item) => `/blog/${item.slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: absoluteUrl(route || "/"),
    lastModified: new Date(),
    changeFrequency: route.includes("/blog/") ? "monthly" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}

