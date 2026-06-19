import { Mail, MapPin, ArrowUpRight } from "lucide-react";

const serviceLinks = [
  { label: "Website Development", href: "/services/website-development" },
  { label: "Admin Dashboard", href: "/services/admin-dashboard" },
  { label: "Client Portal", href: "/services/client-portal" },
  { label: "AI Automation", href: "/services/ai-automation" },
  { label: "Landing Page Design", href: "/services/landing-page-design" },
  { label: "Supabase Setup", href: "/services/supabase-setup" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Industries", href: "/industries" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      {/* Main footer */}
      <div className="section-divider mx-auto max-w-[1800px] px-5 sm:px-8 lg:px-12" />

      <div className="mx-auto max-w-[1800px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="space-y-6">
            <a href="/" className="flex items-center gap-3" aria-label="House Of Dev home">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00A7D8] to-[#7C3AED] text-white font-bold text-sm shadow-lg shadow-[#00A7D8]/20">
                H
              </div>
              <div className="leading-none">
                <p className="text-[13px] font-bold tracking-wider text-white">HOUSE OF DEV</p>
                <p className="text-[9px] font-medium tracking-[0.22em] text-white/35 mt-1 uppercase">
                  Local Business · Growth · Value
                </p>
              </div>
            </a>

            <p className="max-w-xs text-sm leading-7 text-white/48">
              We build websites, dashboards, client portals, and AI automation systems for local businesses ready to go digital.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm text-white/45">
                <Mail className="h-4 w-4 shrink-0 text-[#00A7D8]" aria-hidden="true" />
                <a
                  href="mailto:arasanredt@gmail.com"
                  className="transition hover:text-white"
                >
                  arasanredt@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/45">
                <MapPin className="h-4 w-4 shrink-0 text-[#00A7D8]" aria-hidden="true" />
                <span>India · Remote-first</span>
              </div>
            </div>

            {/* Portal CTA */}
            <a
              href="/portal"
              className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-4 py-2.5 text-xs font-semibold text-white/55 transition hover:border-white/28 hover:text-white"
            >
              Client &amp; Employee Portal
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          {/* Services column */}
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
              Services
            </p>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/52 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
              Company
            </p>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/52 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Start project column */}
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
              Ready to start?
            </p>
            <p className="mb-5 text-sm leading-6 text-white/48">
              Tell us what you need. We&apos;ll turn it into a working digital system your business can rely on.
            </p>
            <a href="/contact" className="btn-primary !text-sm">
              Start a Project
            </a>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#10b981] animate-glow" aria-hidden="true" />
                <span className="text-xs font-semibold text-white/45">
                  Available for new projects
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#00A7D8]" aria-hidden="true" />
                <span className="text-xs font-semibold text-white/45">
                  Fast turnaround · Full-stack
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="section-divider mx-auto max-w-[1800px] px-5 sm:px-8 lg:px-12" />
      <div className="mx-auto max-w-[1800px] px-5 py-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/35">
            © {year} House Of Dev. All rights reserved. Built with Next.js &amp; Supabase.
          </p>
          <div className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs text-white/35 transition hover:text-white/65"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/admin-dashboard"
              className="text-xs text-white/18 transition hover:text-white/35"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
