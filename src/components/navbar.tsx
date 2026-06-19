"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 text-white transition-all duration-300",
        scrolled ? "nav-glass" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1800px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        {/* Brand logo */}
        <a
          href="/"
          className="flex items-center gap-3 shrink-0 group"
          aria-label="House Of Dev – home"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#00A7D8] to-[#7C3AED] text-white font-bold text-sm shadow-lg shadow-[#00A7D8]/20 transition-shadow group-hover:shadow-[#00A7D8]/40">
            H
            <span className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="hidden sm:block leading-none">
            <p className="text-[13px] font-bold tracking-wider text-white leading-none">
              HOUSE OF DEV
            </p>
            <p className="text-[9px] font-medium tracking-[0.22em] text-white/38 mt-1 uppercase">
              Local Business · Growth · Value
            </p>
          </div>
        </a>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Primary navigation"
        >
          {navLinks.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 lg:flex shrink-0">
          <a
            href="/portal"
            className="flex items-center gap-1.5 rounded-lg border border-white/14 px-4 py-2 text-[13px] font-semibold text-white/55 transition-all hover:border-white/30 hover:text-white hover:bg-white/5"
          >
            Client Portal
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <a href="/contact" className="btn-primary !py-2.5 !px-5 !text-[13px]">
            Start a Project
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/14 bg-white/5 text-white backdrop-blur-xl transition hover:bg-white/10 lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "mx-4 mb-3 overflow-hidden rounded-xl border bg-black/96 backdrop-blur-2xl transition-all duration-300 ease-in-out lg:hidden",
          open
            ? "max-h-[520px] opacity-100 border-white/10"
            : "max-h-0 opacity-0 border-transparent",
        )}
        aria-hidden={!open}
      >
        <div className="grid gap-0.5 p-3">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-base font-semibold text-white/75 transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-3 grid gap-2 border-t border-white/10 pt-3">
            <a
              href="/portal"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-white/14 px-4 py-3 text-sm font-semibold text-white/60 transition hover:border-white/3 hover:text-white"
            >
              Client Portal
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <a
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-primary justify-center"
            >
              Start a Project
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
