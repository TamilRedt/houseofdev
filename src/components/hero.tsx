"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Globe, Bot, BarChart3, Sparkles, Workflow, ShieldCheck } from "lucide-react";

const floatingBadges = [
  { text: "Next.js 16", top: "18%", left: "70%", delay: "0s", duration: "7s", rotate: "-8deg" },
  { text: "Supabase", top: "35%", left: "82%", delay: "2s", duration: "9s", rotate: "5deg" },
  { text: "Client Portal", top: "52%", left: "72%", delay: "1s", duration: "8s", rotate: "-4deg" },
  { text: "Vercel", top: "64%", left: "80%", delay: "3s", duration: "10s", rotate: "6deg" },
  { text: "AI Flow", top: "29%", left: "87%", delay: "2.5s", duration: "11s", rotate: "3deg" },
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

const orbitCards = [
  { icon: Workflow, label: "Lead → Project", value: "Auto flow" },
  { icon: ShieldCheck, label: "Client trust", value: "Portal ready" },
  { icon: Sparkles, label: "AI upgrade", value: "Reactive UI" },
];

export function Hero() {
  return (
    <section id="home" className="portfolio-cut-corners relative isolate min-h-[92svh] overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="animate-orb absolute left-[6%] top-[10%] h-[520px] w-[520px] rounded-full opacity-50" style={{ background: "radial-gradient(circle, rgba(0,167,216,0.22) 0%, transparent 68%)" }} />
        <div className="animate-float-slow absolute right-[3%] top-[22%] h-[460px] w-[460px] rounded-full opacity-30" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.26) 0%, transparent 70%)", animationDelay: "3s" }} />
        <div className="animate-float absolute bottom-[5%] left-[22%] h-[300px] w-[300px] rounded-full opacity-25" style={{ background: "radial-gradient(circle, rgba(13,148,136,0.24) 0%, transparent 70%)", animationDelay: "1.5s" }} />
        <div className="portfolio-grid absolute inset-0 opacity-45" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-14 opacity-80"
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

      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.18) 42%, rgba(0,0,0,0.92) 100%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,.82) 26%, transparent 55%, rgba(0,0,0,0.82) 100%)" }} aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        {floatingBadges.map((badge) => (
          <div
            key={badge.text}
            className="animate-float absolute rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-semibold text-white/48 shadow-[0_18px_60px_rgba(0,167,216,.12)] backdrop-blur-sm"
            style={{ top: badge.top, left: badge.left, transform: `rotate(${badge.rotate})`, animationDelay: badge.delay, animationDuration: badge.duration }}
          >
            {badge.text}
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto grid min-h-[92svh] w-full max-w-[1800px] items-center gap-8 px-5 pb-10 pt-24 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(340px,0.58fr)] lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[780px]"
        >
          <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#00A7D8]/30 bg-[#00A7D8]/10 px-4 py-2 shadow-[0_0_35px_rgba(0,167,216,.12)]">
            <span className="animate-glow h-2 w-2 rounded-full bg-[#00A7D8]" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#00A7D8]">House Of Dev · Local Business Transition</span>
          </div>

          <motion.h1
            initial={{ rotateX: 16, y: 22, opacity: 0 }}
            animate={{ rotateX: 0, y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="hero-3d-title text-[clamp(3.1rem,9vw,9.4rem)] font-black leading-[0.83] tracking-[-0.07em] text-white"
          >
            <span className="hero-line">We build</span>
            <span className="hero-line hero-word">digital systems</span>
            <span className="hero-line">for businesses</span>
          </motion.h1>

          <p className="mt-5 max-w-2xl text-[clamp(0.98rem,2vw,1.18rem)] leading-8 text-white/62">
            Websites, dashboards, client portals, and AI automation — every digital tool your business needs to grow, operate efficiently, and serve customers better.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {features.map(({ icon: Icon, text }) => (
              <span key={text} className="feature-3d-pill flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/68">
                <Icon className="h-3.5 w-3.5 text-[#00A7D8]" aria-hidden="true" />
                {text}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a href="/contact" className="btn-primary">Start a Project <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href="/portfolio" className="btn-outline">View Our Work</a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className="hero-stat-3d">
                <p className="text-sm font-black text-white sm:text-base">{stat.value}</p>
                <p className="mt-1 text-[11px] font-semibold text-white/38">{stat.label}</p>
                <span className="absolute inset-x-2 bottom-1 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" aria-hidden="true" />
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 34, rotateY: -12 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <div className="hero-orbit-board">
            <div className="hero-orbit-core">HOD</div>
            <div className="hero-orbit-ring one" />
            <div className="hero-orbit-ring two" />
            <div className="hero-orbit-ring three" />
            {orbitCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className={`hero-orbit-card card-${i + 1}`}>
                  <Icon className="h-5 w-5 text-[#00A7D8]" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-white/35">{card.label}</p>
                  <p className="mt-1 text-lg font-black text-white">{card.value}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
