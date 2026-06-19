"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { PortfolioProject } from "@/lib/portfolio-data";

export function ProjectCard({
  project,
  index,
}: {
  project: PortfolioProject;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.07, 0.2),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative grid overflow-hidden bg-black transition-colors hover:bg-[#172A46]/20 lg:grid-cols-[160px_1fr_220px]"
    >
      {/* Top accent line (gradient on hover) */}
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${project.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        aria-hidden="true"
      />

      {/* Year & number column */}
      <div className="flex flex-col justify-between border-b border-white/8 bg-black p-6 lg:border-b-0 lg:border-r sm:p-8">
        <div className="flex items-start justify-between lg:flex-col lg:gap-0">
          <p className="text-xs font-bold uppercase tracking-widest text-white/30">
            0{index + 1}
          </p>
          <span className={`inline-block rounded-full bg-gradient-to-r ${project.accent} px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white lg:mt-auto`}>
            {project.type}
          </span>
        </div>
        <div className="mt-6 lg:mt-0">
          <p className="text-xs font-semibold text-white/35">Year</p>
          <p className="mt-1 text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-none text-white">
            {project.year.slice(0, 2)}
            <br />
            {project.year.slice(2)}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-black p-6 sm:p-8">
        <h3 className="text-[clamp(2rem,6vw,6rem)] font-semibold leading-[0.88] tracking-tight text-white">
          {project.name}
        </h3>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/58">
          {project.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/4 px-3.5 py-1.5 text-xs font-semibold text-white/55 transition hover:border-white/22 hover:text-white/75"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Role & actions column */}
      <div className="flex flex-col justify-between border-t border-white/8 bg-black p-6 lg:border-l lg:border-t-0 sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/35">
            Role
          </p>
          <p className="mt-2 text-xl font-semibold leading-snug text-white">
            {project.role}
          </p>
        </div>

        <div className="mt-8 grid gap-2">
          <a
            href="/portfolio"
            className="inline-flex min-h-11 items-center justify-between rounded-lg border border-[#00A7D8]/25 bg-[#00A7D8]/8 px-4 py-2.5 text-sm font-semibold text-[#00A7D8] transition hover:border-[#00A7D8]/55 hover:bg-[#00A7D8]/15"
          >
            View Case Study
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            disabled
            className="inline-flex min-h-11 cursor-not-allowed items-center justify-between rounded-lg border border-white/8 px-4 py-2.5 text-sm font-semibold text-white/32"
          >
            Live Demo Coming Soon
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
