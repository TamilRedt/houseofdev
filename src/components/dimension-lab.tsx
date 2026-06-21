"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, ArrowRight, Boxes, BrainCircuit, Gauge, Layers3, MousePointer2, Rotate3D, Sparkles } from "lucide-react";

const objects = [
  { id: "01", name: "Icosahedron", note: "Hover to spin · depth mesh", className: "lab-shape-ico", icon: Boxes },
  { id: "02", name: "Torus Ring", note: "Neon orbit · live parallax", className: "lab-shape-torus", icon: Rotate3D },
  { id: "03", name: "Octa Core", note: "Wireframe pulse · bloom", className: "lab-shape-octa", icon: Sparkles },
];

const panels = [
  { label: "Dashboard", title: "DASHBOARD", subtitle: "Admin Console", icon: Gauge, accent: "#00A7D8" },
  { label: "Client Portal", title: "PORTAL", subtitle: "Project Tracking", icon: Layers3, accent: "#7C3AED" },
  { label: "AI Automation", title: "AI FLOW", subtitle: "Automation Engine", icon: BrainCircuit, accent: "#10b981" },
];

export function DimensionLab() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -18;
    setTilt({ x, y });
  }

  const style = {
    "--rx": `${tilt.y}deg`,
    "--ry": `${tilt.x}deg`,
  } as CSSProperties;

  return (
    <section
      id="process"
      className="relative overflow-hidden bg-black py-16 text-white sm:py-24"
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
        <div className="portfolio-grid absolute inset-0" />
        <div className="absolute left-[8%] top-[16%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[8%] bottom-[10%] h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-[1800px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#00A7D8]">3D Lab · Designed in motion</p>
          <h2 className="mt-4 max-w-3xl text-[clamp(2.8rem,7vw,8rem)] font-black leading-[0.82] tracking-tight">
            Built in
            <br />
            <span className="hero-word text-gradient">three dimensions.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/58">
            Real interactive depth made with CSS 3D, reactive mouse tilt, layered product surfaces, glowing objects, and extruded typography — the same craft we put into every website and dashboard.
          </p>

          <div className="mt-7 flex flex-wrap gap-2 text-xs font-semibold text-white/55">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2">CSS 3D · live reaction · bloom</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Drag feel · mouse parallax · scroll reveal</span>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {objects.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="lab-mini-card group">
                  <div className="flex items-center justify-between text-xs text-white/35">
                    <span>{item.id}</span>
                    <Icon className="h-4 w-4 text-[#00A7D8]" />
                  </div>
                  <div className="mt-4 grid min-h-28 place-items-center">
                    <div className={item.className} />
                  </div>
                  <p className="mt-3 text-sm font-bold text-white">{item.name}</p>
                  <p className="mt-1 text-xs leading-5 text-white/42">{item.note}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, rotateX: 8 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 min-h-[560px] rounded-[2rem] border border-white/10 bg-[#051020]/70 p-5 shadow-[0_40px_120px_rgba(0,0,0,.65)] backdrop-blur-xl sm:p-7"
          style={style}
        >
          <div className="lab-reactive-stage relative h-full min-h-[520px] overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/70 p-5">
            <div className="absolute inset-0 opacity-40" aria-hidden="true">
              <div className="portfolio-grid absolute inset-0" />
            </div>
            <div className="relative z-10 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              <span className="inline-flex items-center gap-2"><Activity className="h-4 w-4 text-emerald-400" /> Live product depth</span>
              <span className="inline-flex items-center gap-2"><MousePointer2 className="h-4 w-4 text-cyan-300" /> Move cursor</span>
            </div>

            <div className="relative z-10 mt-10 grid gap-5 lg:grid-cols-[1fr_0.82fr] lg:items-center">
              <div className="lab-extruded-copy" aria-label="Ship beautiful products">
                <span>SHIP</span>
                <span>BEAUTIFUL</span>
                <span>PRODUCTS</span>
              </div>

              <div className="lab-object-stack" aria-hidden="true">
                <div className="lab-cube">
                  <span className="front">HOD</span>
                  <span className="back" />
                  <span className="right" />
                  <span className="left" />
                  <span className="top" />
                  <span className="bottom" />
                </div>
                <div className="lab-orbit one" />
                <div className="lab-orbit two" />
                <div className="lab-orbit three" />
              </div>
            </div>

            <div className="relative z-10 mt-10 grid gap-4 md:grid-cols-3">
              {panels.map((panel) => {
                const Icon = panel.icon;
                return (
                  <motion.div
                    key={panel.label}
                    whileHover={{ y: -10, rotateX: 8, rotateY: -8 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className="lab-system-panel"
                    style={{ borderColor: `${panel.accent}55`, boxShadow: `0 24px 70px ${panel.accent}16` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: panel.accent }} />
                    <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-white/35">{panel.label}</p>
                    <h3 className="panel-3d-title mt-2" style={{ color: panel.accent }}>{panel.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-white/62">{panel.subtitle}</p>
                    <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-white/35">
                      Explore depth <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
