import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition",
        variant === "primary" &&
          "bg-slate-950 text-white shadow-lg shadow-slate-950/15 hover:bg-blue-700",
        variant === "secondary" &&
          "border border-slate-300 bg-white text-slate-950 hover:border-blue-500 hover:text-blue-700",
        variant === "light" &&
          "border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-slate-950",
        className,
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

