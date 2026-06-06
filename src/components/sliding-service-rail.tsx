"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { services, solutions } from "@/lib/data";

const railItems = [
  ...services.slice(0, 8).map((item) => ({
    label: item.title,
    helper: "Service",
    href: `/services/${item.slug}`,
  })),
  ...solutions.slice(0, 6).map((item) => ({
    label: item.title,
    helper: "Solution",
    href: `/solutions/${item.slug}`,
  })),
];

export function SlidingServiceRail() {
  const items = [...railItems, ...railItems];

  return (
    <section className="overflow-hidden border-y border-slate-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Dynamic Service Options</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Slide through what HouseOfDev can build</h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-slate-600">
            Tap any moving option to open the matching service or solution page.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
        <motion.div
          className="flex w-max gap-3 px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {items.map((item, index) => (
            <Link
              key={`${item.href}-${index}`}
              href={item.href}
              className="group flex min-h-24 w-72 flex-none items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-950/8"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">{item.helper}</p>
                <p className="mt-2 text-base font-semibold text-slate-950">{item.label}</p>
              </div>
              <span className="grid h-10 w-10 flex-none place-items-center rounded-md bg-white text-slate-700 shadow-sm transition group-hover:bg-blue-600 group-hover:text-white">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
