import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { DimensionLab } from "@/components/dimension-lab";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Services } from "@/components/services";
import { Skills } from "@/components/skills";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "House Of Dev — Business Websites, Dashboards & AI Automation",
  description:
    "House Of Dev builds modern websites, admin dashboards, client portals, and AI automation systems for local businesses in India. Full-stack, production-ready digital solutions.",
  path: "/",
  keywords: [
    "House Of Dev",
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
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Services />
      <DimensionLab />
      <Projects />
      <Contact />
    </>
  );
}
