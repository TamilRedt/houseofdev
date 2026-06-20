import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const productionSiteUrl = "https://www.houseofdev.online";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || productionSiteUrl)
  .replace(/\/$/, "")
  .replace(/^https:\/\/houseofdev\.online$/i, productionSiteUrl);

export function absoluteUrl(path = "") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
