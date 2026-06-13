import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleDot,
  Layers3,
  MoveUpRight,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { MotionBlock, MotionGroup, MotionItem } from "@/components/portfolio-motion";
import { portfolioProjects } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Tamilarasan - Web Developer & AI Automation Builder",
  description:
    "Tamilarasan builds websites, dashboards, booking systems, and AI automations that help local businesses move online.",
  path: "/portfolio",
});

const socials = [
  { label: "li", href: "/contact" },
  { label: "ig", href: "/contact" },
  { label: "wa", href: "https://wa.me/918838401597" },
];

const heroServices = ["Business websites", "Booking systems", "Client portals", "AI workflows"];
const heroSwitchWords = ["Websites", "Systems", "Dashboards", "Automation", "Portals"];

const categoryStrip = [
  "Clinics",
  "Restaurants",
  "Training centres",
  "Consultants",
  "Retail shops",
  "Real estate",
  "Construction",
  "Startups",
  "Service teams",
  "Local brands",
];

const capabilityRibbon = [
  "Next.js builds",
  "Supabase apps",
  "WhatsApp handoffs",
  "SEO foundations",
  "AI assistants",
  "Dashboards",
  "Booking flows",
  "Client portals",
];

const techPyramid = [
  ["Next.js"],
  ["Supabase", "AWS"],
  ["Vercel", "SEO", "Automation"],
  ["AI", "CRM", "Forms", "Analytics"],
];

const engineeringStandards = [
  {
    title: "Fast first impression",
    description:
      "Pages are built around mobile speed, clear hierarchy, and contact paths that customers can use without thinking twice.",
  },
  {
    title: "Real business workflows",
    description:
      "Every interface connects to a useful action: inquiry, booking, payment intent, task handoff, dashboard review, or follow-up.",
  },
  {
    title: "Careful data handling",
    description:
      "Forms, portals, and automations are planned with scoped access, predictable storage, and simple recovery paths.",
  },
  {
    title: "Motion with a job",
    description:
      "Animation is used for focus, section changes, stacked previews, and premium feel without slowing the work down.",
  },
];

const processChapters = [
  {
    number: "01",
    title: "Find the daily friction",
    detail:
      "Calls, messages, spreadsheets, repeated questions, missed leads, and unclear service pages are mapped before the design starts.",
    signal: "Discovery",
  },
  {
    number: "02",
    title: "Turn it into a clear interface",
    detail:
      "The public website and internal flow are shaped together so customers know what to do and the business knows what happened.",
    signal: "Design",
  },
  {
    number: "03",
    title: "Build the system behind it",
    detail:
      "Next.js, Supabase, forms, dashboards, and notifications are wired into a small system that can grow after launch.",
    signal: "Build",
  },
  {
    number: "04",
    title: "Automate the repeat work",
    detail:
      "AI and workflow rules are added where they actually save time: lead summaries, reminders, status updates, and admin reports.",
    signal: "Automate",
  },
];

const projectMeta = [
  { role: "Website + Booking", accent: "Patient trust", surface: "Appointment flow" },
  { role: "Website + Leads", accent: "Menu clarity", surface: "Menu and tables" },
  { role: "Website + CRM", accent: "Project proof", surface: "Inquiry pipeline" },
  { role: "Portal + Forms", accent: "Course clarity", surface: "Course discovery" },
  { role: "Dashboard + AI", accent: "Daily control", surface: "Automation hub" },
];

function PortfolioLoopCurtain() {
  return (
    <div className="portfolio-loop-curtain" aria-hidden="true">
      <span className="portfolio-loop-card card-a" />
      <span className="portfolio-loop-card card-b" />
      <span className="portfolio-loop-card card-c" />
      <span className="portfolio-loop-card card-d" />
    </div>
  );
}

function PortfolioRuntimeScript() {
  const code = `
(() => {
  if (window.__houseOfDevPortfolioRuntime) return;
  window.__houseOfDevPortfolioRuntime = true;

  const updateGreeting = () => {
    const target = document.querySelector("[data-time-greeting]");
    if (!target) return;
    const hour = new Date().getHours();
    target.textContent = hour < 5
      ? "Working late"
      : hour < 12
        ? "Good morning"
        : hour < 17
          ? "Good afternoon"
          : "Good evening";
  };

  const getBottomGap = () => document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const curtain = () => document.querySelector(".portfolio-loop-curtain");
  let locked = false;
  let frame = 0;

  const loopToStart = () => {
    if (locked) return;
    locked = true;

    if (prefersReducedMotion()) {
      window.scrollTo({ top: 0, behavior: "auto" });
      window.setTimeout(() => { locked = false; }, 250);
      return;
    }

    const layer = curtain();
    layer?.classList.add("is-active");
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 230);
    window.setTimeout(() => {
      layer?.classList.remove("is-active");
      locked = false;
    }, 980);
  };

  const maybeLoop = () => {
    if (window.scrollY > window.innerHeight && getBottomGap() <= 8) {
      loopToStart();
    }
  };

  updateGreeting();
  window.setInterval(updateGreeting, 60000);
  window.setInterval(maybeLoop, 350);

  window.addEventListener("wheel", (event) => {
    if (event.deltaY > 0 && getBottomGap() <= 18) {
      event.preventDefault();
      loopToStart();
    }
  }, { passive: false });

  window.addEventListener("keydown", (event) => {
    const forward = event.key === "PageDown" || event.key === "End" || event.key === "ArrowDown" || event.key === " ";
    if (forward && getBottomGap() <= 18) {
      event.preventDefault();
      loopToStart();
    }
  });

  window.addEventListener("scroll", () => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      maybeLoop();
    });
  }, { passive: true });
})();
`;

  return <script id="portfolio-runtime" dangerouslySetInnerHTML={{ __html: code }} />;
}

function ProjectStackCard({
  project,
  index,
}: {
  project: (typeof portfolioProjects)[number];
  index: number;
}) {
  const meta = projectMeta[index] ?? projectMeta[0];
  const solvedItems = [...project.goals, ...project.results].slice(0, 4);

  return (
    <div className="portfolio-project-stage relative min-h-[160svh]" style={{ zIndex: 20 + index }}>
      <article className="portfolio-project-card sticky top-16 min-h-[calc(100svh-4rem)] border-t border-white/10 bg-[#070707]/95">
      <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-[0.9fr_1.25fr_0.85fr]">
        <MotionBlock className="flex min-w-0 flex-col justify-between gap-10 px-6 py-9 sm:px-8 lg:border-r lg:border-white/10 lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase text-white/36">
              {String(index + 1).padStart(2, "0")} / {String(portfolioProjects.length).padStart(2, "0")}
            </p>
            <h3 className="mt-7 max-w-lg text-[clamp(2.8rem,5.5vw,6.4rem)] font-black uppercase leading-[0.84] text-white">
              {project.title}
            </h3>
            <p className="mt-6 max-w-md text-base leading-7 text-white/58">{project.summary}</p>
          </div>

          <div className="grid gap-5 text-sm">
            <div>
              <p className="text-xs uppercase text-white/32">Role</p>
              <p className="mt-2 text-white/84">{meta.role}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 5).map((tech) => (
                <span key={tech} className="border border-white/10 px-3 py-1.5 text-xs text-white/54">
                  {tech}
                </span>
              ))}
            </div>
            <Link
              href={`/projects/${project.slug}`}
              className="group inline-flex w-fit items-center gap-3 text-sm font-semibold text-white"
            >
              Open case file
              <span className="grid h-9 w-9 place-items-center border border-white/12 transition group-hover:border-red-500 group-hover:bg-red-500">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </MotionBlock>

        <MotionBlock className="flex min-w-0 items-center justify-center border-y border-white/10 px-6 py-9 sm:px-8 lg:border-y-0 lg:border-r" delay={0.08}>
          <div className="portfolio-project-visual relative w-full max-w-2xl overflow-hidden border border-white/12 bg-[#0b0b0b] shadow-2xl shadow-black/40">
            <div className={`absolute inset-0 bg-gradient-to-br ${project.palette} opacity-55`} />
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(0,0,0,0.16),rgba(0,0,0,0.9)_72%)]" />
            <div className="relative flex items-center justify-between border-b border-white/15 px-5 py-4">
              <div className="flex gap-2">
                <span className="h-2.5 w-2.5 bg-white/70" />
                <span className="h-2.5 w-2.5 bg-white/42" />
                <span className="h-2.5 w-2.5 bg-red-500" />
              </div>
              <p className="text-xs font-semibold uppercase text-white/64">{project.category}</p>
            </div>

            <div className="relative grid min-h-[440px] content-between gap-6 p-5 sm:p-6">
              <div className="portfolio-preview-map grid gap-4 sm:grid-cols-[1fr_0.72fr]">
                <div className="portfolio-preview-panel min-h-56 p-5">
                  <p className="text-xs uppercase text-white/54">{meta.surface}</p>
                  <p className="mt-5 max-w-[12rem] text-4xl font-black uppercase leading-none text-white">
                    {meta.accent}
                  </p>
                  <div className="mt-8 grid gap-3">
                    <span className="h-2 bg-white/82" />
                    <span className="h-2 w-4/5 bg-white/48" />
                    <span className="h-2 w-3/5 bg-white/28" />
                  </div>
                </div>

                <div className="grid gap-3">
                  {project.features.slice(0, 3).map((feature) => (
                    <div key={feature} className="portfolio-preview-line flex items-start gap-3 p-4">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                      <p className="text-sm leading-5 text-white/78">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="portfolio-preview-footer p-5">
                <p className="text-xs uppercase text-white/44">Result signal</p>
                <p className="mt-3 max-w-md text-2xl font-semibold leading-tight text-white">
                  {project.results[0]}
                </p>
              </div>
            </div>
          </div>
        </MotionBlock>

        <MotionGroup className="grid min-w-0 content-between gap-5 px-6 py-7 sm:px-8 lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase text-white/36">What it solves</p>
            <div className="mt-7 grid gap-3">
              {solvedItems.map((item) => (
                <MotionItem key={item} className="portfolio-solved-row p-3 text-sm leading-6 text-white/62">
                  <CheckCircle2 className="mb-4 h-4 w-4 text-red-400" />
                  {item}
                </MotionItem>
              ))}
            </div>
          </div>

          <MotionItem className="border border-red-500/22 bg-red-500/[0.06] p-4">
            <p className="text-xs uppercase text-red-200/72">Next step</p>
            <p className="mt-3 text-base font-semibold leading-6 text-white">
              Replace the editable sample notes with verified client material after launch.
            </p>
          </MotionItem>
        </MotionGroup>
      </div>
      </article>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <div className="portfolio-page-shell bg-[#070707] text-white">
      <PortfolioLoopCurtain />

      <section id="portfolio-loop-start" className="portfolio-hero relative isolate scroll-mt-24 overflow-hidden border-b border-white/10">
        <div className="portfolio-hero-wash absolute inset-0 -z-10" />
        <div className="portfolio-hero-grid grid min-h-[calc(100svh-4rem)] lg:grid-cols-[0.82fr_1.58fr_0.92fr]">
          <MotionBlock className="portfolio-rail flex min-w-0 flex-col justify-between px-6 py-8 sm:px-8 lg:px-10">
            <p className="text-sm text-white/54">
              <span data-time-greeting>Hello</span>
            </p>

            <div>
              <p className="text-sm text-white/48">Hi, this is</p>
              <p className="mt-3 text-2xl font-semibold text-white">
                Tamil<span className="text-white/44">arasan</span>
              </p>
              <p className="mt-4 max-w-[13rem] text-xs uppercase text-white/34">
                HouseOfDev / Web developer and AI automation builder
              </p>
            </div>

            <p className="text-xs text-white/38">(Scroll down)</p>
          </MotionBlock>

          <MotionBlock className="portfolio-hero-stage relative flex min-w-0 items-end px-6 pb-12 pt-16 sm:px-8 lg:px-10" delay={0.08}>
            <div className="portfolio-media-system absolute inset-x-4 bottom-0 top-8 -z-10 sm:inset-x-8">
              <Image
                src="/portfolio/tamilarasan-standing.png"
                alt="Tamilarasan in a black suit"
                fill
                priority
                sizes="(min-width: 1024px) 48vw, 92vw"
                className="portfolio-hero-photo object-cover"
              />
              <div className="portfolio-media-photo-shade" />
              <div className="portfolio-media-frame" />
              <div className="portfolio-media-scan" />
            </div>

            <div className="relative w-full max-w-[58rem]">
              <p className="max-w-md text-sm leading-6 text-white/64">
                A compact digital studio profile for websites, apps, dashboards, and AI workflows
                that help local businesses look trusted and operate cleaner.
              </p>

              <h1 className="portfolio-hero-title mt-8 text-[clamp(3.8rem,9vw,9.8rem)] font-black uppercase leading-[0.82] text-white">
                Digital
                <span className="block">For</span>
                <span className="block text-red-600">Business</span>
              </h1>

              <div className="portfolio-hero-switch mt-7" aria-label="Portfolio capabilities">
                {heroSwitchWords.map((word, index) => (
                  <span key={word} style={{ animationDelay: `${index * 2}s` } as CSSProperties}>
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </MotionBlock>

          <MotionBlock className="portfolio-rail flex min-w-0 flex-col justify-between border-t border-white/10 px-6 py-8 sm:px-8 lg:border-l lg:border-t-0 lg:px-10" delay={0.16}>
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2 text-white/52">
                <span>Socials</span>
                {socials.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-white/42 transition hover:text-white"
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <Link href="/contact" className="text-white underline underline-offset-8">
                Let&apos;s talk
              </Link>
            </div>

            <div className="grid gap-9">
              <div className="space-y-4 border-y border-white/10 py-8 text-sm text-white/56">
                {heroServices.map((service) => (
                  <p key={service}>{service}</p>
                ))}
              </div>
              <Link
                href="/contact"
                className="flex items-center justify-between text-sm font-semibold text-white underline underline-offset-8"
              >
                How can I help?
                <MoveUpRight className="h-4 w-4 text-red-500" />
              </Link>
            </div>

            <div>
              <p className="max-w-xs text-sm leading-6 text-white/60">
                Conversion-first pages, useful systems, CRM flows, SEO foundations, and
                AI-enabled business workflows.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase text-white/34">
                {["Websites", "Apps", "Automation", "AI", "Cloud"].map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </div>
            </div>
          </MotionBlock>
        </div>
      </section>

      <section className="portfolio-strip border-b border-white/10 py-5" aria-label="Business categories">
        <div className="portfolio-marquee overflow-hidden">
          <div className="portfolio-marquee-track">
            {[...categoryStrip, ...categoryStrip].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="profile" className="portfolio-manifesto scroll-mt-24 border-b border-white/10 px-6 py-24 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr_0.85fr]">
          <MotionBlock className="text-sm uppercase text-white/34">
            Index / Profile
          </MotionBlock>

          <MotionBlock delay={0.08}>
            <p className="portfolio-manifesto-text max-w-5xl text-[clamp(2.2rem,5.2vw,6.4rem)] font-semibold leading-[1.02] text-white">
              The goal is to take the messy parts of a business and turn them into a clean online
              experience customers can trust and teams can actually use.
            </p>
          </MotionBlock>

          <MotionBlock className="grid content-between gap-10" delay={0.14}>
            <div className="border-t border-white/10 pt-5">
              <Layers3 className="h-8 w-8 text-emerald-300" />
              <p className="mt-8 text-sm leading-6 text-white/58">
                This is a personal portfolio direction for Tamilarasan and HouseOfDev. No fake
                awards, no fake clients, no fake numbers.
              </p>
            </div>
            <Link
              href="/contact"
              className="group flex items-center justify-between border-t border-white/10 pt-5 text-lg font-semibold text-white"
            >
              Start a project
              <span className="grid h-12 w-12 place-items-center border border-white/12 text-red-500 transition group-hover:border-red-500 group-hover:bg-red-500 group-hover:text-white">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </Link>
          </MotionBlock>
        </div>
      </section>

      <section className="border-b border-white/10 px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr]">
          <MotionGroup className="portfolio-tech-pyramid grid content-start gap-3 self-start">
            {techPyramid.map((row, rowIndex) => (
              <div key={row.join("-")} className="flex justify-center gap-3">
                {row.map((tile, tileIndex) => (
                  <MotionItem
                    key={tile}
                    className="portfolio-tech-pyramid-tile grid h-24 w-28 place-items-center border border-white/10 bg-black/35 p-3 text-center text-xs font-semibold text-white/50"
                  >
                    {rowIndex === 0 || tileIndex === row.length - 1 ? (
                      <Sparkles className="mb-2 h-4 w-4 text-red-500" />
                    ) : null}
                    {tile}
                  </MotionItem>
                ))}
              </div>
            ))}
          </MotionGroup>

          <div className="grid gap-10">
            <MotionBlock>
              <p className="text-sm font-semibold uppercase text-white/34">Stack / Standards</p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.4rem,4.6vw,5.3rem)] font-semibold leading-[1.02] text-white">
                Premium motion is only useful when the business underneath is clear.
              </h2>
            </MotionBlock>

            <MotionGroup className="grid gap-4 sm:grid-cols-2">
              {engineeringStandards.map((standard) => (
                <MotionItem key={standard.title} className="portfolio-standard-panel p-5">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  <h3 className="mt-6 text-lg font-semibold text-white">{standard.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/56">{standard.description}</p>
                </MotionItem>
              ))}
            </MotionGroup>
          </div>
        </div>
      </section>

      <section className="portfolio-capability-band border-b border-white/10 py-10">
        <div className="portfolio-marquee overflow-hidden">
          <div className="portfolio-marquee-track portfolio-marquee-track-reverse">
            {[...capabilityRibbon, ...capabilityRibbon].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="portfolio-process border-b border-white/10">
        {processChapters.map((chapter) => (
          <MotionBlock
            key={chapter.number}
            className="grid min-h-48 border-t border-white/10 px-6 py-8 sm:px-8 lg:grid-cols-[0.28fr_0.4fr_1fr_0.32fr] lg:px-10"
          >
            <p className="text-5xl font-semibold text-white/14">{chapter.number}</p>
            <p className="mt-2 text-sm font-semibold uppercase text-red-300/74 lg:mt-0">{chapter.signal}</p>
            <div className="mt-6 lg:mt-0">
              <h3 className="text-2xl font-semibold text-white">{chapter.title}</h3>
              <p className="mt-4 max-w-3xl text-xl leading-8 text-white/58">{chapter.detail}</p>
            </div>
            <Workflow className="mt-8 h-7 w-7 text-white/18 lg:mt-0" />
          </MotionBlock>
        ))}
      </section>

      <section id="projects" aria-label="Portfolio projects" className="relative scroll-mt-16">
        <div className="portfolio-projects-intro grid border-b border-white/10 px-6 py-14 sm:px-8 lg:grid-cols-[0.88fr_1fr_0.62fr] lg:px-10">
          <MotionBlock>
            <p className="text-sm uppercase text-white/34">Selected systems</p>
            <h2 className="mt-5 text-[clamp(3.6rem,8vw,9rem)] font-black uppercase leading-[0.84] text-white">
              Projects
              <span className="block text-red-600">I build</span>
            </h2>
          </MotionBlock>

          <MotionBlock className="mt-8 max-w-2xl text-lg leading-8 text-white/58 lg:mt-0" delay={0.08}>
            Each project lives on one stacked frame: big project name on the left, a visual system
            preview in the middle, and the solved business problem on the right. Scroll moves the
            stack forward one by one.
          </MotionBlock>

          <MotionBlock className="mt-8 flex items-start justify-start lg:mt-0 lg:justify-end" delay={0.14}>
            <div className="inline-flex items-center gap-3 border border-white/12 px-5 py-3 text-sm font-semibold text-white/72">
              Stack scroll
              <CircleDot className="h-4 w-4 text-red-400" />
            </div>
          </MotionBlock>
        </div>

        <div className="relative">
          {portfolioProjects.map((project, index) => (
            <ProjectStackCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>

      <section className="portfolio-contact-reprise min-h-[calc(100svh-4rem)] border-t border-white/10 px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid min-h-[calc(100svh-12rem)] content-between gap-16">
          <MotionBlock className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr]">
            <div className="grid gap-6">
              <p className="text-sm uppercase text-white/34">Contact / Next build</p>
              <div className="portfolio-contact-photo relative min-h-[380px] overflow-hidden border border-white/10">
                <Image
                  src="/portfolio/tamilarasan-seated.png"
                  alt="Tamilarasan seated in a studio portrait"
                  fill
                  sizes="(min-width: 1024px) 28vw, 92vw"
                  className="object-cover object-[48%_center]"
                />
              </div>
            </div>
            <h2 className="max-w-6xl text-[clamp(3rem,8vw,9rem)] font-black uppercase leading-[0.84] text-white">
              Got a workflow
              <span className="block text-red-600">worth fixing?</span>
            </h2>
          </MotionBlock>

          <MotionGroup className="grid gap-5 lg:grid-cols-3">
            {[
              ["Email", "arasanredt@gmail.com"],
              ["WhatsApp", "+91 88384 01597"],
              ["Focus", "Websites, portals, automation"],
            ].map(([label, value]) => (
              <MotionItem key={label} className="portfolio-contact-cell p-5">
                <p className="text-xs uppercase text-white/34">{label}</p>
                <p className="mt-5 text-xl font-semibold text-white">{value}</p>
              </MotionItem>
            ))}
          </MotionGroup>
        </div>
      </section>

      <div id="portfolio-loop-end" className="h-px" aria-hidden="true" />
      <PortfolioRuntimeScript />
    </div>
  );
}
