"use client";

import { motion } from "framer-motion";
import { Activity, ArrowUpRight, CheckCircle2, CircleDot, Database, Sparkles } from "lucide-react";

const pipeline = [
  "Strategy",
  "Design",
  "Build",
  "Automation",
  "Growth",
];

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="rounded-lg border border-white/15 bg-white/10 p-3 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div className="rounded-md border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
              enterprise-command-center
            </span>
          </div>

          <div className="grid gap-0 md:grid-cols-[1fr_0.8fr]">
            <div className="border-b border-slate-200 p-5 md:border-b-0 md:border-r">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                    Growth Operating System
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">HouseOfDev Launchboard</h3>
                </div>
                <div className="rounded-md bg-emerald-50 p-2 text-emerald-700">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {pipeline.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0.45, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.18,
                      duration: 0.4,
                      repeat: Infinity,
                      repeatDelay: 5,
                      repeatType: "reverse",
                    }}
                    className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <CircleDot className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-slate-800">{item}</span>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-5">
              <div className="rounded-md bg-slate-950 p-4 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Live Performance</p>
                  <Activity className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    ["Lead velocity", "+38%"],
                    ["Load time", "0.9s"],
                    ["SEO score", "100"],
                    ["Automation", "12 flows"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-md border border-white/10 bg-white/5 p-3">
                      <p className="text-[11px] text-slate-400">{label}</p>
                      <p className="mt-2 text-lg font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-md border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-blue-50 p-2 text-blue-700">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">Supabase CRM</p>
                      <p className="text-xs text-slate-500">Lead, project, invoice, support data</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

