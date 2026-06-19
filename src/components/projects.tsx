"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/portfolio-data";

export function Projects() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-black py-24 text-white sm:py-32"
    >
      {/* Background accent */}
      <div
        className="pointer-events-none absolute right-[-15%] top-16 h-[600px] w-[600px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(185,28,28,0.35) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-[1800px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-14 grid gap-6 lg:grid-cols-[1fr_0.42fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#00A7D8]">
              Portfolio
            </p>
            <h2 className="mt-4 text-[clamp(3.5rem,11vw,13rem)] font-semibold leading-[0.8] tracking-tight">
              Projects I
              <br />
              worked on
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pb-4"
          >
            <p className="text-[clamp(3rem,8.5vw,9rem)] font-semibold leading-none text-white/14">
              01-04
            </p>
            <p className="mt-5 max-w-sm text-base leading-7 text-white/55">
              Real builds spanning business websites, dashboards, automation systems, and client portals — all production-ready.
            </p>
            <a
              href="/portfolio"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#00A7D8] transition hover:text-[#14c0f5]"
            >
              View full portfolio
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        {/* Project cards */}
        <div className="grid gap-px bg-white/8">
          {projects.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
