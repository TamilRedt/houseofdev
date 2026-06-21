"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarCheck,
  Cloud,
  Code2,
  Database,
  Globe2,
  Layers3,
  LockKeyhole,
  Rocket,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const stats = [
  ["25+", "Projects Built", "Websites, dashboards, portals, and automation systems delivered"],
  ["15+", "Industries Served", "Healthcare, retail, education, hospitality, professional services"],
  ["100%", "Client-Focused", "Every build is designed around your business operations"],
  ["2026", "Launched & Live", "House Of Dev is a production-ready digital operations platform"],
];

const stackGroups = [
  {
    title: "Frontend",
    icon: Code2,
    color: "pink",
    items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML5 / CSS3"],
  },
  {
    title: "Backend & Data",
    icon: Database,
    color: "blue",
    items: ["Supabase", "PostgreSQL", "Row Level Security", "Server Actions", "Route Handlers", "REST APIs"],
  },
  {
    title: "Deployment",
    icon: Cloud,
    color: "cyan",
    items: ["Vercel", "GitHub CI/CD", "Hostinger DNS", "Custom Domains", "Sitemap & SEO", "Web App Manifest"],
  },
  {
    title: "Automation & AI",
    icon: BrainCircuit,
    color: "green",
    items: ["AI Tools", "WhatsApp Cloud API", "AWS SES Email", "Telegram Bot", "Google Calendar API", "Webhook Workflows"],
  },
];

const services = [
  ["01", "Website Development", "Fast, responsive websites that make a business look trustworthy online.", Code2],
  ["02", "Landing Page Design", "Focused pages built to explain, convert, and capture qualified leads.", Rocket],
  ["03", "Business Website Setup", "Domain, hosting, pages, contact flow, analytics and launch essentials.", Globe2],
  ["04", "Admin Dashboard", "Internal panels for tracking customers, projects, status and operations.", BriefcaseBusiness],
  ["05", "Client Portal", "Secure client views for project updates, files, requests and trust.", LockKeyhole],
  ["06", "AI Automation", "AI-assisted workflows for repetitive tasks, replies, routing and follow-ups.", Bot],
  ["07", "Supabase Setup", "Database, auth, tables, policies and backend-ready foundations.", ServerCog],
  ["08", "Vercel Deployment", "Clean production deployments with speed, previews and reliable delivery.", Cloud],
];

const labCards = [
  ["WebGL style scene", "Animated neon objects, particles, parallax depth and bloom-inspired glows."],
  ["3D product text", "Extruded typography with layered shadows, glow edges and perspective tilt."],
  ["Connected systems", "Dashboard, portal and automation panels linked into one business flow."],
];

export function NeonReferenceHome() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -18;
    setTilt({ x, y });
  }

  const tiltStyle = {
    "--tilt-x": `${tilt.y}deg`,
    "--tilt-y": `${tilt.x}deg`,
  } as CSSProperties;

  return (
    <main className="neon-page">
      <section id="home" className="neon-hero" onMouseMove={handleMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
        <div className="neon-stars" />
        <div className="neon-grid-floor" />
        <div className="float-shape shape-a" />
        <div className="float-shape shape-b" />
        <div className="float-shape shape-c" />
        <div className="float-ring ring-a" />
        <div className="float-ring ring-b" />

        <div className="neon-hero-copy">
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="neon-kicker">
            House Of Dev · Digital Systems Studio
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            We build
            <span>digital systems</span>
            for businesses
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="neon-lead">
            Websites, dashboards, portals, automation systems and AI workflows that help businesses operate better.
          </motion.p>
          <motion.a initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} href="#contact" className="neon-cta">
            Let&apos;s build together <ArrowRight className="h-4 w-4" />
          </motion.a>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18, duration: 0.85 }} className="neon-title-stage" style={tiltStyle}>
          <div className="neon-title-orbit one" />
          <div className="neon-title-orbit two" />
          <div className="neon-big-title">
            <span>HOUSE</span>
            <small>OF</small>
            <strong>DEV</strong>
          </div>
          <div className="neon-platform" />
        </motion.div>

        <div className="neon-stat-row">
          {stats.map(([value, label, text], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="neon-stat-card"
            >
              <strong>{value}</strong>
              <span>{label}</span>
              <p>{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="process" className="neon-stack-map">
        <div className="section-head compact">
          <p>Technology Stack</p>
          <h2>Connected like a digital control room.</h2>
        </div>
        <div className="stack-console">
          <div className="stack-core">
            <span>HOUSE</span>
            <small>OF</small>
            <strong>DEV</strong>
          </div>
          {stackGroups.map((group, index) => {
            const Icon = group.icon;
            return (
              <motion.div key={group.title} className={`stack-node node-${index + 1} ${group.color}`} whileHover={{ y: -10, scale: 1.02 }}>
                <div className="stack-node-title">
                  <Icon className="h-6 w-6" />
                  <h3>{group.title}</h3>
                </div>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}><Sparkles className="h-3.5 w-3.5" />{item}</li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
          <svg className="stack-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M50 50 C34 30, 28 20, 18 19" />
            <path d="M50 50 C68 28, 76 20, 84 18" />
            <path d="M50 50 C32 70, 25 80, 18 82" />
            <path d="M50 50 C66 70, 76 80, 84 82" />
          </svg>
        </div>
      </section>

      <section id="services" className="neon-services">
        <div className="section-head">
          <p>What We Build</p>
          <h2>Services orbiting one business goal.</h2>
        </div>
        <div className="service-orbit">
          <div className="service-center">
            <span>Need a</span>
            <strong>custom solution?</strong>
            <p>We can build exactly what your business needs.</p>
            <a href="#contact">Discuss your project <ArrowRight className="h-4 w-4" /></a>
          </div>
          {services.map(([number, title, text, Icon], index) => (
            <motion.article key={String(title)} className={`service-orbit-card service-${index + 1}`} whileHover={{ y: -12, rotateX: 8, rotateY: -8 }}>
              <Icon className="h-8 w-8" />
              <b>{number}</b>
              <h3>{title}</h3>
              <p>{text}</p>
              <ArrowRight className="h-4 w-4" />
            </motion.article>
          ))}
        </div>
      </section>

      <section id="work" className="neon-lab-strip">
        <div className="lab-copy">
          <p>We craft</p>
          <h2>Beautiful product surfaces.</h2>
          <span>WebGL style · bloom · 3D motion · business systems</span>
        </div>
        <div className="lab-panels">
          {labCards.map(([title, text], index) => (
            <motion.div key={title} className="lab-panel" whileHover={{ y: -10, rotateX: 10 }}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="contact" className="neon-final-band">
        <div className="value-word">LOCAL BUSINESS TRANSITION</div>
        <div className="value-word growth">GROWTH</div>
        <div className="value-word value">VALUE</div>
        <div className="final-contact-card">
          <h2>Ready to make your business look premium online?</h2>
          <p>House Of Dev builds websites, dashboards, client portals, and AI automation systems for local businesses across India.</p>
          <div>
            <a href="mailto:arasanredt@gmail.com">arasanredt@gmail.com</a>
            <a href="tel:+918838401597">+91 88384 01597</a>
          </div>
        </div>
      </section>
    </main>
  );
}
