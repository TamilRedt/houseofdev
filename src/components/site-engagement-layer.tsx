"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp, CalendarCheck, Phone, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

function FloatingAction({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  const className =
    "group relative inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-950 shadow-xl shadow-slate-950/12 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700";
  const content = (
    <>
      <Icon className="h-5 w-5" />
      <span className="pointer-events-none absolute right-full mr-3 hidden rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 md:block">
        {label}
      </span>
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={className} aria-label={label}>
      {content}
    </a>
  );
}

export function SiteEngagementLayer() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28, restDelta: 0.001 });
  const reduceMotion = useReducedMotion();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 520);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <>
      <motion.div
        className="fixed left-0 top-0 z-[90] h-1 origin-left bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-400"
        style={{ scaleX }}
        aria-hidden="true"
      />

      <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-2">
        <FloatingAction href="/contact" label="Book consultation" icon={CalendarCheck} />
        <FloatingAction href="tel:+918838401597" label="Call HouseOfDev" icon={Phone} />
        <button
          type="button"
          onClick={scrollTop}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-slate-950 text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-blue-700 ${
            showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
          }`}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
