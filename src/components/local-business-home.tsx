"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Gauge,
  Globe2,
  MessageCircle,
  MousePointerClick,
  Palette,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wrench,
} from "lucide-react";
import { submitLocalLead, type ActionState } from "@/app/actions";
import type { HomeContent, HomeDemoProject, HomePackage } from "@/lib/homepage-content";

const initialState: ActionState = {
  ok: false,
  message: "Ready",
};

const whatsappUrl =
  "https://wa.me/918838401597?text=Hi%20HouseOfDev%2C%20I%20want%20a%20website%20for%20my%20business.";

const trustBadges = [
  { label: "7-Day Delivery", Icon: Gauge },
  { label: "SEO Ready", Icon: Search },
  { label: "WhatsApp Enquiry", Icon: MessageCircle },
  { label: "Mobile First", Icon: Smartphone },
];

const services = [
  {
    title: "Website Design",
    description: "Mobile-friendly websites built to get more enquiries from local customers.",
    Icon: Palette,
  },
  {
    title: "SEO Setup",
    description: "Local search structure, metadata, schema, and fast pages from launch.",
    Icon: Search,
  },
  {
    title: "WhatsApp Integration",
    description: "Tap-to-chat enquiry paths that help customers reach you quickly.",
    Icon: MessageCircle,
  },
  {
    title: "Booking Forms",
    description: "Simple forms for appointments, quotes, demo calls, and service requests.",
    Icon: CalendarCheck,
  },
  {
    title: "Maintenance",
    description: "Content updates, fixes, backups, monitoring, and monthly support.",
    Icon: Wrench,
  },
  {
    title: "Analytics Setup",
    description: "Track enquiries, package interest, WhatsApp clicks, and page performance.",
    Icon: BarChart3,
  },
];

const processSteps = [
  {
    title: "Discuss",
    description: "We understand your business, services, customers, and enquiry goals.",
    Icon: ClipboardCheck,
  },
  {
    title: "Design",
    description: "We shape a clear mobile-first page flow and premium visual direction.",
    Icon: Palette,
  },
  {
    title: "Build",
    description: "We develop the website, forms, WhatsApp paths, SEO, and analytics.",
    Icon: Code2,
  },
  {
    title: "Launch",
    description: "We deploy, test, connect tracking, and support your first updates.",
    Icon: Sparkles,
  },
];

const businessTypes = ["Clinic", "Restaurant", "Shop", "Salon", "Tuition", "Real Estate", "Other"];
const budgetOptions = ["INR 4,999 - 9,999", "INR 10,000 - 24,999", "INR 25,000 - 75,000", "INR 75,000+"];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
  } as const;
}

function slideLeft(delay = 0) {
  return {
    initial: { opacity: 0, x: 42 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
  } as const;
}

function formatInr(value: number) {
  if (!value) {
    return "Custom";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ProjectMockup({ project }: { project: HomeDemoProject }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
      <div className="flex h-10 items-center gap-2 border-b border-white/10 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-auto rounded bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
          Demo Project
        </span>
      </div>
      <div className="grid gap-3 p-4">
        <div className="h-24 rounded-2xl bg-gradient-to-br from-sky-400/25 to-emerald-400/20 ring-1 ring-white/10" />
        <div className="grid grid-cols-3 gap-2">
          <span className="h-12 rounded-xl bg-white/10" />
          <span className="h-12 rounded-xl bg-white/10" />
          <span className="h-12 rounded-xl bg-white/10" />
        </div>
        <div className="space-y-2">
          <span className="block h-3 w-4/5 rounded bg-white/15" />
          <span className="block h-3 w-2/3 rounded bg-white/10" />
        </div>
        <div className="flex flex-wrap gap-2">
          {project.features.slice(0, 3).map((feature) => (
            <span key={feature} className="rounded-full border border-sky-300/20 bg-sky-300/10 px-2.5 py-1 text-[11px] text-sky-100">
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingCards({
  packages,
  mode,
  onChoose,
}: {
  packages: HomePackage[];
  mode: "one-time" | "monthly";
  onChoose: (packageName: string) => void;
}) {
  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-3">
      {packages.map((plan) => {
        const price = mode === "one-time" ? plan.priceOneTime : plan.priceMonthly;
        const suffix = mode === "monthly" && price ? "/mo" : "";

        return (
          <motion.div
            key={plan.slug}
            {...slideLeft(plan.isPopular ? 0.04 : 0)}
            className={`relative rounded-lg border p-5 shadow-2xl transition hover:-translate-y-1 ${
              plan.isPopular
                ? "border-sky-300/45 bg-sky-300/10 shadow-sky-950/30"
                : "border-white/10 bg-white/[0.04] shadow-slate-950/20"
            }`}
          >
            {plan.isPopular ? (
              <span className="absolute right-4 top-4 rounded-full bg-emerald-400 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-950">
                Most Popular
              </span>
            ) : null}
            <h3 className="pr-28 text-xl font-semibold text-white">{plan.name}</h3>
            <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">{plan.description}</p>
            <p className="mt-5 text-3xl font-semibold text-white">
              {formatInr(price)}
              <span className="text-base text-zinc-400">{suffix}</span>
            </p>
            <div className="mt-5 grid gap-2">
              {plan.features.slice(0, 6).map((feature) => (
                <p key={feature} className="flex items-center gap-2 text-sm text-zinc-200">
                  <CheckCircle2 className="h-4 w-4 flex-none text-emerald-400" />
                  {feature}
                </p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onChoose(plan.name)}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Choose {plan.name}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

export function LocalBusinessHome({ content }: { content: HomeContent }) {
  const [pricingMode, setPricingMode] = useState<"one-time" | "monthly">("one-time");
  const [businessType, setBusinessType] = useState("Clinic");
  const [selectedPackage, setSelectedPackage] = useState("Business");
  const [state, formAction] = useActionState(submitLocalLead, initialState);
  const proofText = useMemo(() => {
    if (content.testimonials.length) {
      return content.testimonials[0].message;
    }

    return "Compact websites, clear enquiry paths, and support systems for serious local businesses.";
  }, [content.testimonials]);

  function choosePackage(packageName: string) {
    setSelectedPackage(packageName);
    scrollToContact();
  }

  return (
    <>
      <section id="hero" className="relative isolate overflow-hidden bg-[#050816] text-white">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
          <motion.div {...fadeUp()}>
            <p className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
              Local Business Website Studio
            </p>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-normal sm:text-5xl lg:text-6xl">
              Websites That Bring Local Businesses Online
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-zinc-300 sm:text-lg">
              We build fast, modern, mobile-friendly websites with WhatsApp enquiry, booking forms, SEO setup, and maintenance for local businesses.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setSelectedPackage("Free Demo");
                  scrollToContact();
                }}
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-sky-300 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-950/30 transition hover:bg-white"
              >
                Get Free Demo
              </button>
              <Link
                href="#work"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950"
              >
                View Work
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {trustBadges.map(({ label, Icon }) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                  <Icon className="h-4 w-4 text-emerald-300" />
                  <p className="mt-2 text-xs font-semibold text-zinc-200">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-lg border border-white/10 bg-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur"
            >
              <div className="rounded-lg border border-white/10 bg-[#0B1020] p-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-auto rounded bg-white/10 px-2 py-1 text-xs text-zinc-400">clinic-demo.local</span>
                </div>
                <div className="grid gap-4 pt-4 md:grid-cols-[1fr_170px]">
                  <div className="rounded-2xl bg-gradient-to-br from-sky-300/20 to-emerald-300/10 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">Clinic Website Preview</p>
                    <h2 className="mt-3 text-2xl font-semibold">Book appointments faster</h2>
                    <p className="mt-3 text-sm leading-6 text-zinc-300">Services, doctors, WhatsApp, booking form, SEO, and analytics.</p>
                    <div className="mt-5 grid gap-2">
                      {["Appointment Form", "WhatsApp CTA", "Google-ready SEO"].map((item) => (
                        <span key={item} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-zinc-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mx-auto w-[150px] rounded-[28px] border border-white/15 bg-black p-2">
                    <div className="min-h-[300px] rounded-[22px] bg-white p-3 text-slate-950">
                      <div className="h-20 rounded-2xl bg-sky-100" />
                      <div className="mt-3 h-3 w-3/4 rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
                      <div className="mt-5 grid gap-2">
                        <span className="h-10 rounded-xl bg-slate-100" />
                        <span className="h-10 rounded-xl bg-slate-100" />
                        <span className="h-10 rounded-xl bg-emerald-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="bg-[#050816] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">Services</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Everything a local business website needs</h2>
          </motion.div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ title, description, Icon }, index) => (
              <motion.div
                key={title}
                {...slideLeft(index * 0.03)}
                className="group rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-sky-300/40 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-sky-950/20"
              >
                <span className="grid h-11 w-11 place-items-center rounded-md bg-sky-300/10 text-sky-200 ring-1 ring-sky-300/20">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="bg-[#050816] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">Work</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Compact demo projects for common local businesses</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-zinc-400">Each card is clearly marked as a demo project and shows the expected business value without fake client claims.</p>
          </motion.div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {content.demoProjects.slice(0, 3).map((project, index) => (
              <motion.article key={project.slug} {...slideLeft(index * 0.05)} className="rounded-lg border border-white/10 bg-[#0B1020] p-4">
                <ProjectMockup project={project} />
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">{project.businessType}</p>
                <h3 className="mt-2 text-xl font-semibold">{project.title}</h3>
                <p className="mt-3 min-h-20 text-sm leading-6 text-zinc-400">{project.description}</p>
                <Link
                  href={project.demoUrl || `/portfolio/${project.slug}`}
                  className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-md border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950"
                >
                  View Demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="bg-[#050816] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">Process</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">A simple launch path</h2>
          </motion.div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {processSteps.map(({ title, description, Icon }, index) => (
              <motion.div key={title} {...slideLeft(index * 0.05)} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-sky-200">0{index + 1}</span>
                  <Icon className="h-5 w-5 text-emerald-300" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#050816] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">Pricing</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Clear packages for serious local businesses</h2>
            </div>
            <div className="inline-flex rounded-md border border-white/10 bg-white/[0.04] p-1">
              {[
                ["one-time", "One-Time Website"],
                ["monthly", "Website + Monthly Maintenance"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPricingMode(value as "one-time" | "monthly")}
                  className={`min-h-10 rounded px-4 text-sm font-semibold transition ${
                    pricingMode === value ? "bg-sky-300 text-slate-950" : "text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
          <PricingCards packages={content.packages} mode={pricingMode} onChoose={choosePackage} />
        </div>
      </section>

      <section id="contact" className="bg-[#050816] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div {...fadeUp()}>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">Contact</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Ready to Bring Your Business Online?</h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">Tell us about your business and we&apos;ll suggest the right website package.</p>
            <div className="mt-6 grid gap-3 text-sm text-zinc-300">
              <a href={whatsappUrl} className="inline-flex items-center gap-2 transition hover:text-emerald-300">
                <MessageCircle className="h-4 w-4 text-emerald-300" />
                WhatsApp: +91 88384 01597
              </a>
              <a href="mailto:arasanredt@gmail.com" className="inline-flex items-center gap-2 transition hover:text-sky-300">
                <Globe2 className="h-4 w-4 text-sky-300" />
                arasanredt@gmail.com
              </a>
              <p className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                {proofText}
              </p>
            </div>
          </motion.div>

          <motion.form action={formAction} {...slideLeft(0.05)} className="grid gap-4 rounded-lg border border-white/10 bg-[#0B1020] p-4 shadow-2xl shadow-black/20 sm:p-5">
            <input type="hidden" name="businessType" value={businessType} />
            <input type="hidden" name="selectedPackage" value={selectedPackage} />
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-zinc-200">Name</span>
              <input name="name" className="min-h-11 rounded-md border border-white/10 bg-white px-3 text-sm text-slate-950 outline-none ring-sky-300/20 transition focus:ring-4" />
            </label>
            <div>
              <span className="text-sm font-semibold text-zinc-200">Business Type</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {businessTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBusinessType(type)}
                    className={`min-h-10 rounded-full border px-3 text-sm font-semibold transition ${
                      businessType === type
                        ? "border-emerald-300 bg-emerald-300 text-slate-950"
                        : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-zinc-200">Phone Number</span>
                <input name="phone" type="tel" className="min-h-11 rounded-md border border-white/10 bg-white px-3 text-sm text-slate-950 outline-none ring-sky-300/20 transition focus:ring-4" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-zinc-200">Email</span>
                <input name="email" type="email" className="min-h-11 rounded-md border border-white/10 bg-white px-3 text-sm text-slate-950 outline-none ring-sky-300/20 transition focus:ring-4" />
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-zinc-200">Budget</span>
              <select name="budget" className="min-h-11 rounded-md border border-white/10 bg-white px-3 text-sm text-slate-950 outline-none ring-sky-300/20 transition focus:ring-4">
                <option value="">Select budget</option>
                {budgetOptions.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-zinc-200">Message</span>
              <textarea key={selectedPackage} name="message" className="min-h-24 rounded-md border border-white/10 bg-white px-3 py-2 text-sm text-slate-950 outline-none ring-sky-300/20 transition focus:ring-4" defaultValue={`I am interested in the ${selectedPackage} package.`} />
            </label>
            <label className="hide-honeypot">
              Website
              <input tabIndex={-1} autoComplete="off" name="website" />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className={state.ok ? "text-sm font-semibold text-emerald-300" : "text-sm text-zinc-400"}>
                {state.message !== "Ready" ? state.message : `Selected package: ${selectedPackage}`}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-sky-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-white">
                  Submit Enquiry
                  <MousePointerClick className="h-4 w-4" />
                </button>
                <a href={whatsappUrl} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950">
                  WhatsApp Us
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.form>
        </div>
      </section>

      <div className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-[#0B1020]/95 p-2 shadow-2xl shadow-black/30 backdrop-blur md:hidden">
        <a href={whatsappUrl} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-400 text-sm font-bold text-slate-950">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <button type="button" onClick={scrollToContact} className="inline-flex min-h-11 items-center justify-center rounded-md bg-sky-300 text-sm font-bold text-slate-950">
          Get Quote
        </button>
      </div>
    </>
  );
}
