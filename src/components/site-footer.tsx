import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { navItems, services } from "@/lib/data";
import { BrandLogo } from "@/components/brand-logo";
import { Container } from "@/components/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#F4F0E6]/10 bg-[#172A46] text-[#F4F0E6]">
      <Container className="pb-28 pt-14 md:pb-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex" aria-label="House Of Dev home">
              <BrandLogo inverted />
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#F4F0E6]/75">
              Helping local businesses move online through professional websites, dashboards,
              booking systems, business automation, and AI-powered workflows.
            </p>
            <div className="mt-6 space-y-3 text-sm text-[#F4F0E6]/75">
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#F4F0E6]" /> Hosur, Bengaluru, and remote across India
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#F4F0E6]" />
                <a href="mailto:arasanredt@gmail.com" className="transition hover:text-white">
                  arasanredt@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#F4F0E6]" />
                <a href="tel:+918838401597" className="transition hover:text-white">
                  +91 88384 01597 (Consultation by appointment)
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#F4F0E6]/55">Company</h3>
            <div className="mt-4 grid gap-3">
              {navItems.slice(4).map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-[#F4F0E6]/75 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#F4F0E6]/55">Services</h3>
            <div className="mt-4 grid gap-3">
              {services.slice(0, 7).map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="text-sm text-[#F4F0E6]/75 hover:text-white"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#F4F0E6]/10 pt-6 text-xs text-[#F4F0E6]/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} House Of Dev. All rights reserved.</p>
          <p>Local Business Transition | Growth | Value</p>
        </div>
      </Container>
    </footer>
  );
}
