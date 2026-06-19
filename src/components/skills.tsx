"use client";

import { motion } from "framer-motion";
import { Code2, Database, Cloud, Cpu } from "lucide-react";

const stackCategories = [
  {
    icon: Code2,
    label: "Frontend",
    color: "#00A7D8",
    tools: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML5 / CSS3"],
  },
  {
    icon: Database,
    label: "Backend & Data",
    color: "#7C3AED",
    tools: ["Supabase", "PostgreSQL", "Row Level Security", "Server Actions", "Route Handlers", "REST APIs"],
  },
  {
    icon: Cloud,
    label: "Deployment",
    color: "#0d9488",
    tools: ["Vercel", "GitHub CI/CD", "Hostinger DNS", "Custom Domains", "Sitemap & SEO", "Web App Manifest"],
  },
  {
    icon: Cpu,
    label: "Automation & AI",
    color: "#f59e0b",
    tools: ["AI Tools", "WhatsApp Cloud API", "AWS SES Email", "Telegram Bot", "Google Calendar API", "Webhook Workflows"],
  },
];

const ticker1 = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL",
  "Framer Motion", "Vercel", "GitHub", "AWS SES", "WhatsApp API", "Telegram",
];

const ticker2 = [
  "AI Automation", "Client Portals", "Admin Dashboards", "Business Websites",
  "Landing Pages", "Database Design", "Authentication", "Role-Based Access",
];

export function Skills() {
  const t1 = [...ticker1, ...ticker1];
  const t2 = [...ticker2, ...ticker2];

  return (
    <section className="overflow-hidden bg-black py-20 text-white">
      {/* Ticker rows */}
      <div className="mb-16 space-y-4">
        <div className="ticker-wrap border-y border-white/6 py-4">
          <div className="ticker-inner animate-ticker gap-6 flex">
            {t1.map((item, i) => (
              <span
                key={`t1-${i}`}
                className="whitespace-nowrap text-sm font-semibold text-white/35 px-4"
              >
                {item}
                <span className="ml-6 text-[#00A7D8]/30">·</span>
              </span>
            ))}
          </div>
        </div>

        <div className="ticker-wrap border-y border-white/6 py-4">
          <div
            className="ticker-inner animate-ticker gap-6 flex"
            style={{ animationDirection: "reverse", animationDuration: "40s" }}
          >
            {t2.map((item, i) => (
              <span
                key={`t2-${i}`}
                className="whitespace-nowrap text-sm font-semibold text-white/28 px-4"
              >
                {item}
                <span className="ml-6 text-[#7C3AED]/30">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stack categories */}
      <div className="mx-auto w-full max-w-[1800px] px-5 sm:px-8 lg:px-12">
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="text-sm font-bold uppercase tracking-[0.2em] text-[#00A7D8]"
          >
            Technology Stack
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.06 }}
            className="mt-3 text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[0.9] tracking-tight"
          >
            Modern tools,
            <br />
            <span className="text-gradient">production-ready</span> builds
          </motion.h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stackCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-2xl border border-white/7 bg-[#172A46]/20 p-6"
              >
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}25` }}
                >
                  <Icon className="h-5 w-5" style={{ color: cat.color }} aria-hidden="true" />
                </div>
                <p className="mb-4 text-sm font-bold uppercase tracking-widest text-white/45">
                  {cat.label}
                </p>
                <ul className="space-y-2">
                  {cat.tools.map((tool) => (
                    <li
                      key={tool}
                      className="flex items-center gap-2 text-sm font-semibold text-white/70"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: cat.color }}
                        aria-hidden="true"
                      />
                      {tool}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
