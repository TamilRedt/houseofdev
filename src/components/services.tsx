"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { services } from "@/lib/portfolio-data";

const serviceColors: Record<string, { icon: string; border: string }> = {
  "Website Development": { icon: "#00A7D8", border: "rgba(0,167,216,0.18)" },
  "Landing Page Design": { icon: "#7C3AED", border: "rgba(124,58,237,0.18)" },
  "Business Website Setup": { icon: "#0d9488", border: "rgba(13,148,136,0.18)" },
  "Admin Dashboard": { icon: "#f59e0b", border: "rgba(245,158,11,0.18)" },
  "Client Portal": { icon: "#ec4899", border: "rgba(236,72,153,0.18)" },
  "AI Automation": { icon: "#7C3AED", border: "rgba(124,58,237,0.18)" },
  "Supabase Setup": { icon: "#10b981", border: "rgba(16,185,129,0.18)" },
  "Vercel Deployment": { icon: "#00A7D8", border: "rgba(0,167,216,0.18)" },
};

export function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-black py-24 text-white sm:py-32"
    >
      {/* Background */}
      <div
        className="pointer-events-none absolute right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-[1800px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#00A7D8]">
              What We Build
            </p>
            <h2 className="mt-4 max-w-3xl text-[clamp(2.8rem,8vw,8.5rem)] font-semibold leading-[0.86] tracking-tight">
              Services for
              <br />
              digital{" "}
              <span className="text-gradient">growth</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="shrink-0 lg:pb-3"
          >
            <a href="/services" className="btn-outline">
              View All Services
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        {/* Services grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = getIcon(service.icon);
            const colors = serviceColors[service.title] ?? {
              icon: "#00A7D8",
              border: "rgba(0,167,216,0.18)",
            };

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: Math.min(index * 0.06, 0.3),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="service-card shimmer-card p-6"
              >
                {/* Icon */}
                <div
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    background: `${colors.border}`,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <Icon
                    className="h-6 w-6"
                    style={{ color: colors.icon }}
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {service.description}
                </p>

                {/* Arrow */}
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[#00A7D8] opacity-0 transition-opacity group-hover:opacity-100">
                  <a
                    href="/services"
                    className="flex items-center gap-1.5 text-xs font-semibold text-white/35 transition hover:text-[#00A7D8]"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#172A46]/60 bg-[#172A46]/25 p-6 sm:flex-row sm:p-8"
          style={{ backdropFilter: "blur(16px)" }}
        >
          <div>
            <p className="text-base font-semibold text-white">
              Need a custom solution?
            </p>
            <p className="mt-1 text-sm text-white/50">
              We can build exactly what your business needs — talk to us about your requirements.
            </p>
          </div>
          <a href="/contact" className="btn-primary shrink-0">
            Discuss Your Project
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
