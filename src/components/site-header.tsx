"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
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
    <header className="sticky top-0 z-50 border-b border-[#172A46]/10 bg-[#F4F0E6]/95 text-[#172A46] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="min-w-0 shrink-0" aria-label="House Of Dev home">
          <BrandLogo />
        </Link>
        <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label="Main navigation">
          {homeLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition hover:bg-[#172A46]/8"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <PortalAuthDialog triggerTone="light" />
          <Link
            href="/#contact"
            className="inline-flex h-10 items-center whitespace-nowrap rounded-md bg-[#172A46] px-5 text-sm font-bold text-[#F4F0E6] shadow-lg shadow-[#172A46]/15 transition hover:bg-[#243d63]"
          >
            Get Quote
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#172A46]/15 lg:hidden"
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
            className="overflow-hidden border-t border-[#172A46]/10 bg-[#F4F0E6] lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-1 overflow-x-hidden px-4 py-4 sm:px-6">
              {homeLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-3 text-sm font-semibold hover:bg-[#172A46]/8"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2">
                <PortalAuthDialog triggerTone="light" compact />
              </div>
              <Link
                href="/#contact"
                className="mt-2 inline-flex min-h-11 items-center justify-center rounded-md bg-[#172A46] px-4 py-3 text-sm font-bold text-[#F4F0E6]"
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
