"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Globe, Bot, BarChart3 } from "lucide-react";

const floatingBadges = [
  { text: "Next.js 16", top: "22%", left: "72%", delay: "0s", duration: "7s", rotate: "-8deg" },
  { text: "Supabase", top: "38%", left: "83%", delay: "2s", duration: "9s", rotate: "5deg" },
  { text: "TypeScript", top: "54%", left: "74%", delay: "1s", duration: "8s", rotate: "-4deg" },
  { text: "Tailwind CSS", top: "66%", left: "81%", delay: "3s", duration: "10s", rotate: "6deg" },
  { text: "Vercel", top: "44%", left: "89%", delay: "1.5s", duration: "6s", rotate: "-5deg" },
  { text: "AI Tools", top: "28%", left: "86%", delay: "2.5s", duration: "11s", rotate: "3deg" },
];

const stats = [
  { value: "20+", label: "Projects built" },
  { value: "5+", label: "Industries served" },
  { value: "Full-Stack", label: "Capabilities" },
  { value: "Fast", label: "Turnaround" },
];

const features = [
  { icon: Globe, text: "Business websites" },
  { icon: BarChart3, text: "Admin dashboards" },
  { icon: Bot, text: "AI automation" },
  { icon: Zap, text: "Client portals" },
];

export function Hero() {
  return (
    <section
      id="home"
      className="portfolio-cut-corners relative isolate min-h-[100svh] overflow-hidden bg-black text-white"
    >
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="animate-orb absolute left-[8%] top-[15%] h-[600px] w-[600px] rounded-full opacity-50"
          style={{ background: "radial-gradient(circle, rgba(23,42,70,0.7) 0%, transparent 70%)" }}
        />
        <div
          className="animate-float-slow absolute right-[5%] top-[30%] h-[450px] w-[450px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(0,167,216,0.25) 0%, transparent 70%)",
            animationDelay: "3s",
          }}
        />
        <div
          className="animate-float absolute bottom-[8%] left-[25%] h-[350px] w-[350px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
            animationDelay: "1.5s",
          }}
        />
        {/* Grid pattern */}
        <div
          className="portfolio-grid absolute inset-0 opacity-40"
          aria-hidden="true"
        />
      </div>

      {/* Hero image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-20"
        aria-hidden="true"
      >
        <Image
          src="/tamilarasan-chair.png"
          alt="Tamilarasan, founder of House Of Dev — web developer and AI automation builder"
          fill
          priority
          sizes="100vw"
          className="object-contain object-bottom"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.88) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.97) 0%, transparent 32%, transparent 62%, rgba(0,0,0,0.88) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Floating tech badges */}
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        aria-hidden="true"
      >
        {floatingBadges.map((badge) => (
          <div
            key={badge.text}
            className="animate-float absolute rounded-full border border-white/10 bg-black/55 px-4 py-2 text-xs font-semibold text-white/45 backdrop-blur-sm"
            style={{
              top: badge.top,
              left: badge.left,
              transform: `rotate(${badge.rotate})`,
              animationDelay: badge.delay,
              animationDuration: badge.duration,
            }}
          >
            {badge.text}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1800px] flex-col justify-end px-5 pb-14 pt-28 sm:px-8 lg:px-12 lg:pb-18">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[680px]"
        >
          {/* Brand pill */}
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#00A7D8]/25 bg-[#00A7D8]/8 px-4 py-2">
            <span className="animate-glow h-2 w-2 rounded-full bg-[#00A7D8]" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#00A7D8]">
              House Of Dev · Local Business Transition
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-[clamp(3.4rem,10vw,10rem)] font-semibold leading-[0.84] tracking-tight text-white">
            We build
            <br />
            digital{" "}
            <span className="text-gradient">systems</span>
            <br />
            for businesses
          </h1>

          <p className="mt-6 max-w-lg text-[clamp(1rem,2.2vw,1.2rem)] leading-8 text-white/60">
            Websites, dashboards, client portals, and AI automation — every digital tool your business needs to grow, operate efficiently, and serve customers better.
          </p>

          {/* Feature pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {features.map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/65"
              >
                <Icon className="h-3.5 w-3.5 text-[#00A7D8]" aria-hidden="true" />
                {text}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="/contact" className="btn-primary">
              Start a Project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="/portfolio" className="btn-outline">
              View Our Work
            </a>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-wrap items-center gap-8 border-t border-white/8 pt-8"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-4">
              {i > 0 && (
                <span className="hidden h-5 w-px bg-white/12 sm:block" aria-hidden="true" />
              )}
              <div>
                <p className="text-base font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
