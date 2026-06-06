"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Bot, Cloud, Gauge, ShieldCheck } from "lucide-react";

const signals = [
  {
    label: "Website Launch",
    value: "14 days",
    helper: "Strategy to production",
    Icon: Gauge,
  },
  {
    label: "AI Automations",
    value: "12 flows",
    helper: "Lead capture, CRM, support",
    Icon: Bot,
  },
  {
    label: "Cloud Stack",
    value: "99.9%",
    helper: "Vercel, Supabase, AWS",
    Icon: Cloud,
  },
  {
    label: "Portal Security",
    value: "RLS",
    helper: "Role-based access control",
    Icon: ShieldCheck,
  },
];

export function LiveSignalStrip() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = signals[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % signals.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="border-y border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-emerald-400 text-slate-950">
            <Activity className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">Live Build Signals</p>
            <p className="text-sm text-slate-300">Updated delivery focus</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {signals.map((signal, index) => {
            const Icon = signal.Icon;
            const isActive = index === activeIndex;

            return (
              <button
                key={signal.label}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`min-h-24 rounded-md border px-4 py-3 text-left transition ${
                  isActive ? "border-emerald-300 bg-white text-slate-950" : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <Icon className={isActive ? "h-4 w-4 text-emerald-700" : "h-4 w-4 text-emerald-300"} />
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">{signal.label}</span>
                </div>
                <AnimatePresence mode="wait">
                  {active.label === signal.label ? (
                    <motion.div
                      key={signal.value}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      <p className="mt-3 text-2xl font-semibold">{signal.value}</p>
                      <p className={isActive ? "mt-1 text-sm text-slate-600" : "mt-1 text-sm text-slate-300"}>{signal.helper}</p>
                    </motion.div>
                  ) : (
                    <div>
                      <p className="mt-3 text-2xl font-semibold">{signal.value}</p>
                      <p className={isActive ? "mt-1 text-sm text-slate-600" : "mt-1 text-sm text-slate-300"}>{signal.helper}</p>
                    </div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
