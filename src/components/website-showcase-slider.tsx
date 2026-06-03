"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Utensils,
} from "lucide-react";
import { Container } from "@/components/container";

const websiteSlides = [
  {
    title: "Business Website",
    audience: "Local brands, consultants, service teams",
    result: "Fast pages, trust-building sections, and high-intent consultation flows.",
    href: "/services/business-website-development",
    icon: BriefcaseBusiness,
    accent: "bg-blue-600",
    surface: "from-blue-50 via-white to-emerald-50",
    blocks: ["Hero", "Services", "Proof", "Contact"],
  },
  {
    title: "E-Commerce Store",
    audience: "Retail, food, product businesses",
    result: "Product discovery, checkout-ready journeys, offers, and order automation.",
    href: "/services/e-commerce-development",
    icon: ShoppingBag,
    accent: "bg-emerald-600",
    surface: "from-emerald-50 via-white to-amber-50",
    blocks: ["Catalog", "Cart", "Offers", "Orders"],
  },
  {
    title: "Clinic Booking Site",
    audience: "Doctors, clinics, hospitals",
    result: "Appointment requests, doctor profiles, patient-friendly service pages.",
    href: "/industries/clinics",
    icon: Stethoscope,
    accent: "bg-cyan-600",
    surface: "from-cyan-50 via-white to-blue-50",
    blocks: ["Doctors", "Booking", "Services", "FAQ"],
  },
  {
    title: "Restaurant Website",
    audience: "Restaurants, cafes, cloud kitchens",
    result: "Menu browsing, table inquiries, WhatsApp leads, and location-first SEO.",
    href: "/industries/restaurants",
    icon: Utensils,
    accent: "bg-rose-600",
    surface: "from-rose-50 via-white to-orange-50",
    blocks: ["Menu", "Gallery", "Offers", "Reserve"],
  },
  {
    title: "Education Platform",
    audience: "Schools, academies, trainers",
    result: "Course pages, admissions inquiries, student support, and content hubs.",
    href: "/industries/educational-institutions",
    icon: GraduationCap,
    accent: "bg-violet-600",
    surface: "from-violet-50 via-white to-cyan-50",
    blocks: ["Courses", "Admissions", "Events", "Support"],
  },
  {
    title: "Real Estate Showcase",
    audience: "Builders, architects, construction teams",
    result: "Project galleries, inquiry qualification, timelines, and credibility proof.",
    href: "/industries/construction-companies",
    icon: Building2,
    accent: "bg-amber-600",
    surface: "from-amber-50 via-white to-lime-50",
    blocks: ["Projects", "Plans", "Timeline", "Inquiry"],
  },
  {
    title: "SaaS Dashboard",
    audience: "Startups, operations teams, founders",
    result: "Role-based apps, dashboards, workflow tools, and customer portals.",
    href: "/services/web-application-development",
    icon: LayoutDashboard,
    accent: "bg-slate-900",
    surface: "from-slate-100 via-white to-blue-50",
    blocks: ["Metrics", "Tasks", "Users", "Reports"],
  },
];

export function WebsiteShowcaseSlider() {
  const [active, setActive] = useState(0);
  const slide = websiteSlides[active];
  const Icon = slide.icon;

  function move(direction: number) {
    setActive((current) => (current + direction + websiteSlides.length) % websiteSlides.length);
  }

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (info.offset.x < -70 || info.velocity.x < -350) {
      move(1);
    }

    if (info.offset.x > 70 || info.velocity.x > 350) {
      move(-1);
    }
  }

  return (
    <section className="bg-white py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Interactive Website Ideas
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              Swipe through the kinds of websites we can create
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Explore common website formats for businesses that need leads, bookings, sales, proof, and operational clarity.
            </p>
            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => move(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-800 transition hover:bg-slate-100"
                aria-label="Previous website idea"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-800 transition hover:bg-slate-100"
                aria-label="Next website idea"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-slate-950/12">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.title}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, x: 44 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -44 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className={`min-h-[460px] cursor-grab rounded-md bg-gradient-to-br ${slide.surface} p-4 active:cursor-grabbing sm:p-6`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`grid h-11 w-11 place-items-center rounded-md ${slide.accent} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">{slide.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{slide.audience}</p>
                    </div>
                  </div>
                  <Sparkles className="h-5 w-5 text-amber-500" />
                </div>

                <div className="mt-6 rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-950/8">
                  <div className="flex h-10 items-center gap-2 border-b border-slate-200 px-4">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-3 h-5 flex-1 rounded bg-slate-100" />
                  </div>
                  <div className="grid min-h-[285px] gap-4 p-4 sm:grid-cols-[0.85fr_1.15fr]">
                    <div className="grid gap-3">
                      <div className={`h-24 rounded-md ${slide.accent}`} />
                      <div className="h-4 w-4/5 rounded bg-slate-200" />
                      <div className="h-4 w-3/5 rounded bg-slate-100" />
                      <div className="mt-auto grid grid-cols-2 gap-2">
                        <div className="h-16 rounded-md bg-slate-100" />
                        <div className="h-16 rounded-md bg-slate-100" />
                      </div>
                    </div>
                    <div className="grid gap-3">
                      {slide.blocks.map((block, index) => (
                        <div key={block} className="rounded-md border border-slate-200 bg-white p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-800">{block}</p>
                            <span className={`h-2.5 w-12 rounded-full ${index % 2 ? "bg-emerald-300" : "bg-blue-300"}`} />
                          </div>
                          <div className="mt-3 h-3 rounded bg-slate-100" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-sm leading-6 text-slate-700">{slide.result}</p>
                  <Link
                    href={slide.href}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Explore
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-2 py-4">
              {websiteSlides.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`h-2.5 rounded-full transition ${
                    index === active ? "w-8 bg-white" : "w-2.5 bg-white/35 hover:bg-white/70"
                  }`}
                  aria-label={`Show ${item.title}`}
                  aria-current={index === active ? "true" : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
