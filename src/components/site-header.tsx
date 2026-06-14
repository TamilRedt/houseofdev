"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { PortalAuthDialog } from "@/components/portal-auth-dialog";
import { industries, navItems, services, solutions } from "@/lib/data";
import { cn } from "@/lib/utils";

const megaColumns = [
  {
    title: "Services",
    href: "/services",
    items: services.slice(0, 6).map((item) => ({ label: item.title, href: `/services/${item.slug}` })),
  },
  {
    title: "Industries",
    href: "/industries",
    items: industries.slice(0, 6).map((item) => ({ label: item.title, href: `/industries/${item.slug}` })),
  },
  {
    title: "Solutions",
    href: "/solutions",
    items: solutions.slice(0, 6).map((item) => ({ label: item.title, href: `/solutions/${item.slug}` })),
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="HouseOfDev home">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-sm font-bold text-white">
            HD
          </span>
          <span className="text-base font-semibold tracking-normal text-slate-950">HouseOfDev</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const hasMega = item.label === "Services";

            if (hasMega) {
              return (
                <div className="group relative" key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
                      active && "bg-slate-100 text-slate-950",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <div className="invisible absolute left-0 top-full w-[720px] translate-y-3 opacity-0 transition group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
                    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-950/12">
                      <div className="grid grid-cols-3 gap-4">
                        {megaColumns.map((column) => (
                          <div key={column.title}>
                            <Link
                              href={column.href}
                              className="mb-3 flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-blue-50 hover:text-blue-700"
                            >
                              {column.title}
                              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </Link>
                            <div className="space-y-1">
                              {column.items.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
                  active && "bg-slate-100 text-slate-950",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <PortalAuthDialog />
          <Link
            href="/contact"
            className="inline-flex h-10 items-center whitespace-nowrap rounded-md bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-slate-950"
          >
            Get Free Consultation
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-900 xl:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="border-t border-slate-200 bg-white xl:hidden"
        >
          <div className="mx-auto grid max-w-7xl gap-1 px-5 py-4 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-3 py-2">
              <PortalAuthDialog />
            </div>
            <Link
              href="/contact"
              className="mt-2 inline-flex min-h-11 items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Get Free Consultation
            </Link>
          </div>
        </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

