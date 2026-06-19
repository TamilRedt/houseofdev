"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { profile } from "@/lib/portfolio-data";
import {
  Stethoscope,
  ShoppingBag,
  Utensils,
  Briefcase,
  GraduationCap,
  Building2,
  CheckCircle2,
} from "lucide-react";

function Counter({
  value,
  suffix,
  label,
  description,
}: {
  value: number;
  suffix: string;
  label: string;
  description: string;
}) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1800, bounce: 0 });
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) =>
      setDisplay(Math.round(latest))
    );
    return unsubscribe;
  }, [spring]);

  return (
    <div
      ref={ref}
      className="stat-card group border-b border-white/10 pb-6 transition-colors"
    >
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="text-[clamp(2.8rem,6vw,5.5rem)] font-semibold leading-none text-white"
      >
        {display}
        <span className="text-gradient">{suffix}</span>
      </motion.p>
      <p className="mt-3 text-base font-semibold text-white">{label}</p>
      <p className="mt-1 text-sm leading-6 text-white/45">{description}</p>
    </div>
  );
}

const counters = [
  {
    value: 20,
    suffix: "+",
    label: "Projects Built",
    description: "Websites, dashboards, portals, and automation systems delivered",
  },
  {
    value: 5,
    suffix: "+",
    label: "Industries Served",
    description: "Healthcare, retail, education, hospitality, and professional services",
  },
  {
    value: 100,
    suffix: "%",
    label: "Client-Focused",
    description: "Every build is designed around your business operations, not templates",
  },
  {
    value: 2026,
    suffix: "",
    label: "Launched & Live",
    description: "House Of Dev is a production-ready digital operations platform",
  },
];

const industries = [
  { icon: Stethoscope, name: "Healthcare & Clinics", color: "#0d9488" },
  { icon: ShoppingBag, name: "Retail & E-commerce", color: "#00A7D8" },
  { icon: Utensils, name: "Food & Hospitality", color: "#f59e0b" },
  { icon: Briefcase, name: "Professional Services", color: "#7C3AED" },
  { icon: GraduationCap, name: "Education & Training", color: "#ec4899" },
  { icon: Building2, name: "Local Business", color: "#10b981" },
];

const strengths = [
  "Business-first thinking — we solve real problems, not just code features",
  "Modern tech stack: Next.js, React, TypeScript, Supabase, Tailwind CSS",
  "Role-based portals: Admin, Employee, and Client all connected",
  "AI automation for emails, WhatsApp, booking, and follow-ups",
  "Production deployments on Vercel with proper DNS and SEO setup",
  "Ongoing support — not just build and disappear",
];

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-black py-24 text-white sm:py-32"
    >
      {/* Background accent */}
      <div
        className="pointer-events-none absolute left-[-10%] top-[-5%] h-[500px] w-[500px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(23,42,70,0.8) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-[1800px] px-5 sm:px-8 lg:px-12">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#00A7D8]">
            About House Of Dev
          </p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2.4rem,6vw,6.5rem)] font-semibold leading-[0.88] tracking-tight">
            Offline businesses deserve digital systems that actually work.
          </h2>
        </motion.div>

        {/* Stats counters */}
        <div className="mb-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {counters.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Counter {...c} />
            </motion.div>
          ))}
        </div>

        {/* Main two-column section */}
        <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[500px] overflow-hidden rounded-2xl bg-[#050505] lg:sticky lg:top-28"
          >
            <Image
              src={profile.portraitImage}
              alt="Tamilarasan — founder of House Of Dev"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10" />
            {/* Overlay label */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[#00A7D8]">
                Tamilarasan
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                Founder & Lead Developer
              </p>
              <p className="mt-1 text-sm text-white/50">House Of Dev</p>
            </div>
          </motion.div>

          {/* Text content */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5 text-lg leading-8 text-white/65"
            >
              <p>
                House Of Dev is a web development and AI automation agency built
                to help local businesses transition to the digital world — with
                professional websites, operational dashboards, client portals, and
                automated workflows.
              </p>
              <p>
                Founded by Tamilarasan, a full-stack developer and automation
                builder, every project is built with real business operations in
                mind: not just a beautiful website, but a system your team can
                use daily.
              </p>
            </motion.div>

            {/* Strengths list */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              {strengths.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#00A7D8]"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-white/70">{item}</p>
                </div>
              ))}
            </motion.div>

            {/* Industries we build for */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-white/45">
                Industries we build for
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {industries.map(({ icon: Icon, name, color }) => (
                  <div
                    key={name}
                    className="industry-badge flex items-center gap-3 px-4 py-3"
                  >
                    <Icon
                      className="h-4 w-4 shrink-0"
                      style={{ color }}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-semibold text-white/70">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
