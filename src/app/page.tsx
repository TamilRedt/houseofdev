import { NeonReferenceHome } from "@/components/neon-reference-home";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "House Of Dev — 3D Digital Systems Studio",
  description:
    "House Of Dev builds cinematic business websites, admin dashboards, client portals, and AI automation systems for local businesses in India.",
  path: "/",
  keywords: [
    "House Of Dev",
    "3D website design India",
    "Business Websites India",
    "Admin Dashboard Development",
    "Client Portal",
    "AI Automation",
    "Next.js Developer India",
    "Supabase Development",
    "Local Business Digital Transformation",
  ],
});

export default function Home() {
  return <NeonReferenceHome />;
}
