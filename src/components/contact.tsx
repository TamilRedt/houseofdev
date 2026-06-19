"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, MessageCircle, GitBranch, Link, ArrowRight } from "lucide-react";
import { profile } from "@/lib/portfolio-data";

const contactMethods = [
  {
    icon: Mail,
    label: "Email us",
    value: profile.email,
    href: `mailto:${profile.email}`,
    color: "#00A7D8",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Coming soon",
    href: "#contact",
    color: "#10b981",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "India · Remote-first",
    href: null,
    color: "#f59e0b",
  },
];

const socialLinks = [
  {
    icon: GitBranch,
    label: "GitHub",
    href: "#contact",
    note: "Profile link coming soon",
  },
  {
    icon: Link,
    label: "LinkedIn",
    href: "#contact",
    note: "Profile link coming soon",
  },
  {
    icon: Mail,
    label: "Email",
    href: `mailto:${profile.email}`,
    note: profile.email,
  },
];

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [statusMsg, setStatusMsg] = useState("All fields are required.");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();
    const subject = encodeURIComponent(`Project inquiry from ${name || "a visitor"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    setStatus("sending");
    setStatusMsg("Opening your email client…");
    setTimeout(() => {
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
      setStatusMsg("Your email client should open. We'll reply within 24 hours.");
    }, 400);
  }

  return (
    <section
      id="contact"
      className="portfolio-cut-corners relative overflow-hidden bg-black py-24 text-white sm:py-32"
    >
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at 70% 80%, rgba(124,58,237,0.3) 0%, transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-0 top-0 h-1/2 w-1/2 opacity-15"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(0,167,216,0.3) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-[1800px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#00A7D8]">
            Get In Touch
          </p>
          <h2 className="mt-4 max-w-5xl text-[clamp(3rem,9vw,11rem)] font-semibold leading-[0.84] tracking-tight">
            Let&apos;s make something
            <br />
            <span className="text-gradient">happen</span> together
          </h2>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* Left column — info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10"
          >
            {/* Portrait */}
            <div className="relative h-[340px] overflow-hidden rounded-2xl bg-[#050505]">
              <Image
                src={profile.portraitImage}
                alt="Tamilarasan — available for projects"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#00A7D8]">
                  Available for projects
                </p>
                <p className="mt-1 text-base font-semibold text-white">
                  Let&apos;s discuss what you need
                </p>
              </div>
            </div>

            {/* Contact methods */}
            <div className="space-y-3">
              {contactMethods.map(({ icon: Icon, label, value, href, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-xl border border-white/7 bg-[#172A46]/20 p-4 transition hover:border-white/15"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${color}18`, border: `1px solid ${color}25` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/40">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-semibold text-white transition hover:text-[#00A7D8]"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-white">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/35">
                Find us online
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ icon: Icon, label, href, note }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-4 py-2.5 text-sm font-semibold text-white/60 transition hover:border-white/25 hover:text-white"
                    title={note}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right column — form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-2xl border border-white/8 bg-[#172A46]/18 p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-white">
                Send us a message
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Tell us about your project. We&apos;ll get back to you within 24 hours.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
                noValidate
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wide text-white/45">
                      Your Name
                    </span>
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#00A7D8]/50 focus:bg-white/6"
                      placeholder="Your full name"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wide text-white/45">
                      Email Address
                    </span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#00A7D8]/50 focus:bg-white/6"
                      placeholder="you@example.com"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wide text-white/45">
                    Service Interested In
                  </span>
                  <select
                    name="service"
                    className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white/80 outline-none transition focus:border-[#00A7D8]/50"
                  >
                    <option value="">Select a service</option>
                    <option>Website Development</option>
                    <option>Admin Dashboard</option>
                    <option>Client Portal</option>
                    <option>AI Automation</option>
                    <option>Landing Page Design</option>
                    <option>Supabase Setup</option>
                    <option>Other / Multiple</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wide text-white/45">
                    Tell us about your project
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#00A7D8]/50 focus:bg-white/6"
                    placeholder="Describe what you want to build — your business, the problem, and what you need."
                  />
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className="text-xs leading-5 text-white/40"
                    aria-live="polite"
                  >
                    {statusMsg}
                  </p>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-primary shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {status === "sending" ? "Opening…" : "Send Message"}
                  </button>
                </div>
              </form>
            </div>

            {/* Alternative CTA */}
            <div className="mt-5 rounded-xl border border-white/7 bg-white/3 p-5 text-center">
              <p className="text-sm text-white/50">
                Prefer to book a consultation directly?
              </p>
              <a
                href="/contact"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#00A7D8] transition hover:text-[#14c0f5]"
              >
                Book a free consultation call
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
