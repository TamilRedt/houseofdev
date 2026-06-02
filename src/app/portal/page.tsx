import { 
  Building2, 
  FolderHeart, 
  HelpCircle, 
  Layers, 
  MessageSquareCode, 
  Settings 
} from "lucide-react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/seo";

// Explicitly type the tuple array: [title, description, Icon component]
const items: [string, string, React.ComponentType<{ className?: string }>][] = [
  ["Client Workspace", "Access project roadmaps, track milestone deliverables, and check environment deployments.", Building2],
  ["Service Directory", "Explore customizable technology offerings, consulting schedules, and integration solutions.", Layers],
  ["Project Sandbox", "Review code reviews, design asset prototypes, and operational beta environments.", FolderHeart],
  ["Communication Hub", "Connect with dedicated account managers and technical architecture leads instantly.", MessageSquareCode],
  ["Support Matrix", "Open technical help requests, report bug incidents, and trace priority ticket queues.", HelpCircle],
  ["Profile Center", "Configure company organization settings, invoicing details, and billing parameters.", Settings]
];

export const metadata = createMetadata({
  title: "Client Portal",
  description: "Secure digital interface for HouseOfDev clients to manage projects, solutions, and account assets.",
  path: "/portal",
});

export default function ClientPortalPage() {
  return (
    <>
      <PageHero
        eyebrow="Client Portal"
        title="Welcome to your centralized business command suite"
        description="Oversee development lifecycles, interact directly with your delivery engineering teams, and view active invoices."
      />
      <section className="bg-slate-50 py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(([title, description, Icon]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                <Icon className="h-6 w-6 text-emerald-600" />
                <h2 className="mt-5 text-xl font-semibold text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
