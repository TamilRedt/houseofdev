import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { navItems, services } from "@/lib/data";
import { Container } from "@/components/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <Container className="pb-28 pt-14 md:pb-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-white text-sm font-bold text-slate-950">
                HD
              </span>
              <span className="text-lg font-semibold">HouseOfDev</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              Transforming businesses into powerful digital brands through premium websites, web
              applications, automation, AI, cloud, SEO, and enterprise-grade digital systems.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-emerald-400" /> Hosur, Bangalore, and remote across India
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-emerald-400" /> 
                <a href="mailto:arasanredt@gmail.com" className="hover:text-white transition">
                  arasanredt@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-emerald-400" /> 
                <a href="tel:+918838401597" className="hover:text-white transition">
                  +91 88384 01597 (Consultation by appointment)
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Company</h3>
            <div className="mt-4 grid gap-3">
              {navItems.slice(4).map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-slate-300 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Services</h3>
            <div className="mt-4 grid gap-3">
              {services.slice(0, 7).map((item) => (
                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="text-sm text-slate-300 hover:text-white"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} HouseOfDev. All rights reserved.</p>
          <p>Built with Next.js 16, TypeScript, Supabase, AWS, and Vercel.</p>
        </div>
      </Container>
    </footer>
  );
}
