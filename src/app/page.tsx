import { UploadedMotionHome } from "@/components/uploaded-motion-home";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "House Of Dev — Ultra Reactive Website UI",
  description:
    "House Of Dev builds business websites, motion interfaces, dashboards, client portals, and automation systems for local businesses.",
  path: "/",
  keywords: [
    "House Of Dev",
    "business website design",
    "motion website UI",
    "admin dashboard development",
    "client portal",
    "automation systems",
    "Next.js developer",
    "Supabase development",
  ],
});

export default function Home() {
  return <UploadedMotionHome />;
}
