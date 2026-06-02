import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { technologyStack } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

const values = ["Premium craft", "Reliable delivery", "Future-focused systems", "Clear communication"];
const process = ["Discover", "Design", "Develop", "Launch", "Optimize"];
const timeline = [
  "Started with business websites and local SEO foundations",
  "Expanded into web applications, dashboards, and automation",
  "Built cloud-ready systems with Supabase, AWS, and Vercel",
  "Now focused on AI-enabled business transformation for Indian and global clients",
];

export const metadata = createMetadata({
  title: "About Us",
  description:
    "Learn about HouseOfDev mission, vision, values, process, technology stack, team approach, and growth journey.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About HouseOfDev"
        title="A premium digital agency built for ambitious businesses"
        description="HouseOfDev helps businesses look credible, operate smarter, automate faster, and grow with stronger digital systems."
      />
      <section className="bg-white py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
                alt="HouseOfDev team strategy workshop"
                width={1400}
                height={980}
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div>
              <SectionHeader
                eyebrow="Mission"
                title="Make world-class digital infrastructure accessible to growing businesses"
                description="Our mission is to help local businesses, startups, consultants, retail stores, institutions, and enterprises become stronger digital brands with practical, scalable technology."
              />
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-950">Vision</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Become a trusted digital transformation partner for businesses that want premium execution without unnecessary complexity.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-950">Values</h3>
                  <div className="mt-3 space-y-2">
                    {values.map((value) => (
                      <p key={value} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        {value}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="premium-gradient py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="Why Choose Us"
                title="Strategy-led delivery with production engineering discipline"
                description="We care about the full business outcome: first impression, conversion, operations, performance, security, and the path after launch."
              />
              <div className="mt-8 grid gap-3">
                {process.map((step, index) => (
                  <div key={step} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionHeader
                eyebrow="Technologies"
                title="Modern stack, chosen for speed and maintainability"
                description="We use tools that support scalable delivery, excellent SEO, secure data flows, and fast iteration."
              />
              <div className="mt-8 grid grid-cols-2 gap-3">
                {technologyStack.map((tech) => (
                  <div key={tech} className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20">
        <Container>
          <SectionHeader
            eyebrow="Growth Journey"
            title="A focused timeline toward enterprise-grade delivery"
            description="HouseOfDev is designed to grow from premium website delivery into full digital operations, AI, and cloud transformation."
          />
          <div className="mt-10 grid gap-4">
            {timeline.map((item, index) => (
              <div key={item} className="grid gap-4 rounded-lg border border-slate-200 p-5 sm:grid-cols-[120px_1fr]">
                <p className="font-mono text-sm font-semibold text-blue-700">Phase {index + 1}</p>
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

