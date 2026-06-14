import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { ScrollReveal } from "@/components/scroll-reveal";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="dark-panel relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:34px_34px] opacity-45" />
      <Container className="relative py-16 sm:py-20">
        <ScrollReveal direction="right">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">{eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold tracking-normal sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-slate-200">{description}</p>
          {children ? <div className="mt-8">{children}</div> : null}
        </ScrollReveal>
      </Container>
    </section>
  );
}

