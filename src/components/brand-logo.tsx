import type { SVGProps } from "react";

export function HouseOfDevMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="hodMark" x1="8" y1="8" x2="56" y2="56">
          <stop stopColor="#22d3ee" />
          <stop offset="0.55" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="#07111f" />
      <path d="M12 30 32 13l20 17v18.5A4.5 4.5 0 0 1 47.5 53h-31A4.5 4.5 0 0 1 12 48.5V30Z" fill="none" stroke="url(#hodMark)" strokeWidth="5" strokeLinejoin="round" />
      <path d="M23 51V37h18v14" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="31" r="3" fill="#22d3ee" />
      <circle cx="32" cy="25" r="3" fill="#60a5fa" />
      <circle cx="41" cy="31" r="3" fill="#a78bfa" />
      <path d="m27 29 2.5-2M35 27.5l3.2 1.8" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function BrandLogo({ compact = false, inverted = false }: { compact?: boolean; inverted?: boolean }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-3">
      <HouseOfDevMark className={compact ? "h-9 w-9 flex-none" : "h-10 w-10 flex-none"} />
      {!compact ? (
        <span className="min-w-0">
          <span className={`block truncate text-sm font-bold tracking-tight ${inverted ? "text-white" : "text-slate-950"}`}>HouseOfDev</span>
          <span className={`block truncate text-[10px] font-semibold uppercase tracking-[0.16em] ${inverted ? "text-slate-400" : "text-slate-500"}`}>Local to online</span>
        </span>
      ) : null}
    </span>
  );
}
