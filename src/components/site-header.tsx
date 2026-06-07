"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { PortalAuthDialog } from "@/components/portal-auth-dialog";

const homeLinks = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/88 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="HouseOfDev home">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-white text-sm font-bold text-slate-950">
            HD
          </span>
          <span className="text-base font-semibold tracking-normal">HouseOfDev</span>
        </Link>

        <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label="Main navigation">
          {homeLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <PortalAuthDialog />
          <Link
            href="/#contact"
            className="inline-flex h-10 items-center whitespace-nowrap rounded-md bg-sky-300 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-950/20 transition hover:bg-white"
          >
            Get Quote
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-white lg:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/10 bg-[#050816] lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:px-6">
              {homeLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2">
                <PortalAuthDialog />
              </div>
              <Link
                href="/#contact"
                className="mt-2 inline-flex min-h-11 items-center justify-center rounded-md bg-sky-300 px-4 py-3 text-sm font-bold text-slate-950"
                onClick={() => setMobileOpen(false)}
              >
                Get Quote
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
