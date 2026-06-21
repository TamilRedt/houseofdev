"use client";

import { motion } from "framer-motion";
import { Code2, Database, Cloud, Cpu, GitBranch, Shield, Workflow, Globe2 } from "lucide-react";

const stackCategories = [
  { icon: Code2, label: "Frontend", color: "#00A7D8", tools: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML5 / CSS3"] },
  { icon: Database, label: "Backend & Data", color: "#7C3AED", tools: ["Supabase", "PostgreSQL", "Row Level Security", "Server Actions", "Route Handlers", "REST APIs"] },
  { icon: Cloud, label: "Deployment", color: "#0d9488", tools: ["Vercel", "GitHub CI/CD", "Hostinger DNS", "Custom Domains", "Sitemap & SEO", "Web App Manifest"] },
  { icon: Cpu, label: "Automation & AI", color: "#f59e0b", tools: ["AI Tools", "WhatsApp Cloud API", "AWS SES Email", "Telegram Bot", "Google Calendar API", "Webhook Workflows"] },
];

const rootNodes = [
  { icon: Globe2, label: "Business Website", top: "9%", left: "42%", color: "#00A7D8" },
  { icon: Workflow, label: "Client Flow", top: "36%", left: "7%", color: "#10b981" },
  { icon: Shield, label: "Secure Portal", top: "72%", left: "31%", color: "#7C3AED" },
  { icon: GitBranch, label: "Deploy Pipeline", top: "58%", left: "73%", color: "#f59e0b" },
];

const ticker1 = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Framer Motion", "Vercel", "GitHub", "AWS SES", "WhatsApp API", "Telegram"];
const ticker2 = ["AI Automation", "Client Portals", "Admin Dashboards", "Business Websites", "Landing Pages", "Database Design", "Authentication", "Role-Based Access"];

export function Skills() {
  const t1 = [...ticker1, ...ticker1];
  const t2 = [...ticker2, ...ticker2];

  return (
    <section className="overflow-hidden bg-black py-16 text-white sm:py-24">
      <div className="mb-12 space-y-4">
        <div className="ticker-wrap border-y border-white/6 py-3">
          <div className="ticker-inner animate-ticker flex gap-6">
            {t1.map((item, i) => (
              <span key={`t1-${i}`} className="whitespace-nowrap px-4 text-sm font-semibold text-white/35">
                {item}<span className="ml-6 text-[#00A7D8]/30">·</span>
              </span>
            ))}
          </div>
        </div>
        <div className="ticker-wrap border-y border-white/6 py-3">
          <div className="ticker-inner animate-ticker flex gap-6" style={{ animationDirection: "reverse", animationDuration: "40s" }}>
            {t2.map((item, i) => (
              <span key={`t2-${i}`} className="whitespace-nowrap px-4 text-sm font-semibold text-white/28">
                {item}<span className="ml-6 text-[#7C3AED]/30">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1800px] gap-8 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-12">
        <div>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className="text-sm font-bold uppercase tracking-[0.2em] text-[#00A7D8]">
            Technology Stack
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: 0.06 }} className="mt-3 text-[clamp(2.2rem,5vw,4.5rem)] font-black leading-[0.9] tracking-tight">
            Modern tools,
            <br />
            <span className="text-gradient">production-ready</span> builds
          </motion.h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/55">
            Instead of flat lists, the stack now behaves like a living root system: frontend, backend, deployment, and automation connect into one House Of Dev operating engine.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="mindmap-stage relative min-h-[620px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#051020]/80 p-5 shadow-[0_35px_120px_rgba(0,0,0,.58)] sm:p-8"
        >
          <div className="absolute inset-0 opacity-35" aria-hidden="true"><div className="portfolio-grid absolute inset-0" /></div>
          <div className="mindmap-root">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200/65">House Of Dev</span>
            <strong>Digital Growth Engine</strong>
            <small>Website · Dashboard · Portal · Automation</small>
          </div>

          {rootNodes.map((node, index) => {
            const Icon = node.icon;
            return (
              <div key={node.label} className="mindmap-node" style={{ top: node.top, left: node.left, borderColor: `${node.color}66`, boxShadow: `0 20px 70px ${node.color}20` }}>
                <Icon className="h-5 w-5" style={{ color: node.color }} />
                <span>{node.label}</span>
                <i>{String(index + 1).padStart(2, "0")}</i>
              </div>
            );
          })}

          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="mindmap-line" d="M50 50 C44 32, 49 23, 49 16" />
            <path className="mindmap-line" d="M50 50 C34 43, 20 40, 14 43" />
            <path className="mindmap-line" d="M50 50 C42 62, 38 72, 39 79" />
            <path className="mindmap-line" d="M50 50 C62 51, 70 57, 80 64" />
          </svg>

          <div className="relative z-10 mt-[260px] grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stackCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.label} whileHover={{ y: -8, rotateX: 8, rotateY: -5 }} transition={{ type: "spring", stiffness: 230, damping: 18 }} className="mindmap-card">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}30` }}>
                    <Icon className="h-5 w-5" style={{ color: cat.color }} aria-hidden="true" />
                  </div>
                  <p className="mb-4 text-sm font-black uppercase tracking-widest text-white/58">{cat.label}</p>
                  <ul className="grid gap-2">
                    {cat.tools.map((tool) => (
                      <li key={tool} className="flex items-center gap-2 rounded-lg border border-white/7 bg-white/[0.035] px-3 py-2 text-xs font-semibold text-white/66">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: cat.color }} aria-hidden="true" />
                        {tool}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
