"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { PortalAuthDialog } from "@/components/portal-auth-dialog";

const homeLinks = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/86 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1800px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="min-w-0 shrink-0" aria-label="House Of Dev home">
          <BrandLogo inverted />
        </Link>
        <nav className="hidden items-center justify-center gap-3 lg:flex" aria-label="Main navigation">
          {homeLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-bold text-white/82 transition hover:bg-white/8 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <PortalAuthDialog triggerTone="dark" />
          <Link
            href="/#contact"
            className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-xl border border-fuchsia-400/70 bg-black/30 px-5 text-sm font-black uppercase tracking-wide text-white shadow-[0_0_28px_rgba(255,63,244,.22)] transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-100"
          >
            Start a Project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 lg:hidden"
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
            className="overflow-hidden border-t border-white/10 bg-black/95 lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-1 overflow-x-hidden px-4 py-4 sm:px-6">
              {homeLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-3 text-sm font-semibold text-white/82 hover:bg-white/8"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2">
                <PortalAuthDialog triggerTone="dark" compact />
              </div>
              <Link
                href="/#contact"
                className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-fuchsia-400/70 bg-black/30 px-4 py-3 text-sm font-black uppercase text-white"
                onClick={() => setMobileOpen(false)}
              >
                Start a Project <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
