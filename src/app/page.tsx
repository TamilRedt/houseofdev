import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { HeroVisual } from "@/components/hero-visual";
import { ProjectVisual } from "@/components/project-visual";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeader } from "@/components/section-header";
import { StatCounter } from "@/components/stat-counter";
import { WebsiteShowcaseSlider } from "@/components/website-showcase-slider";
import { getIcon } from "@/lib/icons";
import {
  industries,
  portfolioProjects,
  pricingPackages,
  services,
  solutions,
  stats,
  technologyStack,
} from "@/lib/data";

export default function Home() {
  const featuredServices = services.slice(0, 8);
  const featuredProject = portfolioProjects[0];

  return (
    <>
      <section className="dark-panel overflow-hidden">
        <Container className="grid min-h-[calc(100vh-4rem)] items-center gap-12 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Premium Digital Agency
            </p>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-normal text-white sm:text-5xl lg:text-6xl">
              Transform Your Business Into a Powerful Online Brand
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-200">
              Professional websites, web applications, business automation, cloud solutions, AI
              integrations, and digital transformation services designed to help businesses grow
              faster.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" variant="light">
                Get Free Consultation
              </ButtonLink>
              <ButtonLink href="/services" variant="secondary" className="border-white/20 bg-white text-slate-950">
                View Services
              </ButtonLink>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="border-l border-white/15 pl-4">
                  <p className="text-2xl font-semibold text-white">
                    {stat.value}
                    {stat.suffix}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <HeroVisual />
        </Container>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <Container className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </Container>
      </section>

      <WebsiteShowcaseSlider />

      <section className="premium-gradient py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeader
              eyebrow="What We Build"
              title="A complete digital growth partner for serious businesses"
              description="HouseOfDev combines brand-quality websites with the operational systems that make growth manageable: CRM, portals, automation, dashboards, cloud, and AI."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredServices.map((service, index) => {
                const Icon = getIcon(service.icon);
                return (
                  <ScrollReveal key={service.slug} delay={index * 0.03}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="group block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-950/8"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="rounded-md bg-blue-50 p-2 text-blue-700">
                          <Icon className="h-5 w-5" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:text-blue-600" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-950">{service.title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{service.description}</p>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <ScrollReveal>
              <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-950">
                <Image
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80"
                  alt="Digital agency team planning product interfaces"
                  width={1400}
                  height={980}
                  className="h-[420px] w-full object-cover opacity-85"
                  priority={false}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 to-transparent p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    Enterprise-grade delivery
                  </p>
                  <h2 className="mt-3 max-w-xl text-2xl font-semibold text-white">
                    Strategy, design, engineering, launch, and ongoing optimization in one team.
                  </h2>
                </div>
              </div>
            </ScrollReveal>

            <div>
              <SectionHeader
                eyebrow="Industries"
                title="Built for local businesses, startups, and enterprises"
                description="Every business category needs a different conversion path. We tune content, workflows, integrations, and proof around the way your customers actually decide."
              />
              <div className="mt-8 grid grid-cols-2 gap-3">
                {industries.slice(0, 10).map((industry) => (
                  <Link
                    key={industry.slug}
                    href={`/industries/${industry.slug}`}
                    className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
                  >
                    {industry.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="surface-grid bg-slate-50 py-20">
        <Container>
          <SectionHeader
            align="center"
            eyebrow="Solutions"
            title="Operational systems that make growth easier to manage"
            description="The website is only the front door. Behind it, we build the workflows, dashboards, portals, and automations that keep the business moving."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {solutions.slice(0, 6).map((solution) => {
              const Icon = getIcon(solution.icon);
              return (
                <Link
                  key={solution.slug}
                  href={`/solutions/${solution.slug}`}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-950/8"
                >
                  <Icon className="h-5 w-5 text-blue-600" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">{solution.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{solution.description}</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <SectionHeader
                eyebrow="Portfolio"
                title="Realistic business outcomes, designed like premium products"
                description="From clinic bookings to restaurant inquiries and corporate lead generation, every build is structured around measurable business movement."
              />
              <div className="mt-8 space-y-3">
                {featuredProject.results.map((result) => (
                  <p key={result} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {result}
                  </p>
                ))}
              </div>
              <div className="mt-8">
                <ButtonLink href="/portfolio">View Portfolio</ButtonLink>
              </div>
            </div>
            <ScrollReveal>
              <ProjectVisual project={featuredProject} />
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
                Production Stack
              </p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Scalable architecture with the tools modern teams trust
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-300">
                Built for performance, security, SEO, maintainability, and future integrations.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {technologyStack.map((item) => (
                <div key={item} className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20">
        <Container>
          <SectionHeader
            align="center"
            eyebrow="Pricing"
            title="Clear starting packages with room for custom enterprise work"
            description="Start with the package that matches your current stage. Every plan can be expanded with automation, AI, dashboards, and managed growth support."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pricingPackages.map((item) => (
              <Link
                key={item.name}
                href="/pricing"
                className={`rounded-lg border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                  item.featured
                    ? "border-blue-500 bg-blue-50 shadow-blue-950/8"
                    : "border-slate-200 bg-white shadow-slate-950/5"
                }`}
              >
                <h3 className="text-xl font-semibold text-slate-950">{item.name}</h3>
                <p className="mt-3 text-3xl font-semibold text-blue-700">{item.price}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">{item.description}</p>
                <div className="mt-5 space-y-2">
                  {item.features.slice(0, 4).map((feature) => (
                    <p key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      {feature}
                    </p>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="premium-gradient py-20">
        <Container>
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-xl shadow-slate-950/8 sm:p-10 lg:flex lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Ready to grow online
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-slate-950">
                Let us turn your business into a premium digital brand with systems that scale.
              </h2>
            </div>
            <div className="mt-8 lg:mt-0">
              <ButtonLink href="/contact">Book Free Consultation</ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
