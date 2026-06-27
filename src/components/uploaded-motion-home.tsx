"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CalendarCheck,
  Code2,
  Database,
  Globe2,
  Layers3,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const services = [
  {
    icon: Globe2,
    title: "High-converting business websites",
    text: "Modern landing pages for clinics, salons, gyms, restaurants, tuition centres and service businesses with WhatsApp, maps, reviews, packages and clear CTA flow.",
    tags: ["Next.js", "SEO blocks", "Mobile-first"],
  },
  {
    icon: BrainCircuit,
    title: "AI automation layer",
    text: "Follow-up flows, enquiry sorting, reminders, email drafts, WhatsApp alerts and admin tasks made simple for small businesses.",
    tags: ["AI workflow", "CRM-lite", "Alerts"],
  },
  {
    icon: CalendarCheck,
    title: "Booking & payment",
    text: "Consultation forms, fast booking option, Razorpay-ready payment flow and appointment status.",
    tags: ["₹50 fast consult", "Forms", "Appointments"],
  },
  {
    icon: Database,
    title: "Admin dashboards",
    text: "Track enquiries, project progress, client requests, delivery stages and business metrics with a clean Supabase-ready data layer.",
    tags: ["Supabase", "Postgres", "RBAC"],
  },
];

const explainItems = [
  {
    id: "1",
    title: "Hero glow",
    text: "The cyan/violet glow pulls attention to the brand name first and makes HouseOfDev feel premium, tech-focused and memorable.",
  },
  {
    id: "2",
    title: "Floating objects",
    text: "Code blocks, cubes, rings and AI shapes show websites, dashboards, automation and lead systems without boring stock images.",
  },
  {
    id: "3",
    title: "Magnetic CTA",
    text: "The call-to-action reacts to the mouse so the visitor naturally notices the enquiry and WhatsApp path.",
  },
  {
    id: "4",
    title: "Bento cards",
    text: "Service cards explain what you sell while 3D hover makes each business module feel interactive and premium.",
  },
  {
    id: "5",
    title: "Particle network",
    text: "The moving background represents connected systems: website, leads, dashboard, project status and automation.",
  },
];

const motionCards = [
  {
    title: "3D object system",
    text: "Cube, sphere, torus, prism and helix objects move in different loops so the scene feels alive, layered and technical.",
    chips: ["CSS 3D", "Orbit motion", "Parallax"],
  },
  {
    title: "AI interface surface",
    text: "Glass dashboard, reactive light, animated bars and product panels communicate that HouseOfDev builds real business systems.",
    chips: ["Glass UI", "Counters", "Lead OS"],
  },
  {
    title: "Performance-friendly motion",
    text: "The design uses CSS transforms and a lightweight canvas particle layer instead of heavy video files.",
    chips: ["Canvas", "GPU transforms", "Responsive"],
  },
];

const pricing = [
  { name: "Starter", price: "₹4,999+", text: "Single-page local business website", list: ["Responsive landing page", "WhatsApp CTA", "Google Maps", "Basic SEO"] },
  { name: "Business", price: "₹14,999+", text: "Full business site with lead flow", list: ["5–8 pages", "Lead forms", "Portfolio/services", "Analytics setup"], featured: true },
  { name: "Automation", price: "Custom", text: "Dashboard + portal + AI workflows", list: ["Supabase backend", "Client portal", "Admin dashboard", "AI alerts"] },
];

export function UploadedMotionHome() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [activeExplain, setActiveExplain] = useState(explainItems[0]);

  useEffect(() => {
    const root = document.documentElement;
    const cursor = cursorRef.current;
    const progress = progressRef.current;
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouse = { x: width / 2, y: height / 2 };
    let smooth = { ...mouse };
    let frame = 0;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; hue: number }> = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(120, Math.max(54, Math.floor(width / 14)));
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        r: Math.random() * 1.7 + 0.7,
        hue: index % 3,
      }));
    };

    const onPointerMove = (event: PointerEvent) => {
      mouse = { x: event.clientX, y: event.clientY };
      root.style.setProperty("--mx", `${event.clientX}px`);
      root.style.setProperty("--my", `${event.clientY}px`);
    };

    const onScroll = () => {
      if (!progress) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    };

    const sceneMove = (event: PointerEvent) => {
      if (!scene) return;
      const rect = scene.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      scene.style.setProperty("--ry", `${(x * 14).toFixed(2)}deg`);
      scene.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
    };

    const sceneLeave = () => {
      if (!scene) return;
      scene.style.setProperty("--ry", "0deg");
      scene.style.setProperty("--rx", "0deg");
    };

    const animate = () => {
      smooth.x += (mouse.x - smooth.x) * 0.16;
      smooth.y += (mouse.y - smooth.y) * 0.16;
      if (cursor) {
        cursor.style.left = `${smooth.x}px`;
        cursor.style.top = `${smooth.y}px`;
      }

      ctx.clearRect(0, 0, width, height);
      for (const particle of particles) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 155) {
          particle.vx += (dx / dist) * 0.015;
          particle.vy += (dy / dist) * 0.015;
        }
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.992;
        particle.vy *= 0.992;
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fillStyle = particle.hue === 0 ? "rgba(34,211,238,.62)" : particle.hue === 1 ? "rgba(139,92,246,.55)" : "rgba(236,72,153,.46)";
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 112) {
            ctx.strokeStyle = `rgba(148,163,184,${(1 - dist / 112) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      frame = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.16 },
    );
    document.querySelectorAll(".um-reveal").forEach((element) => observer.observe(element));

    resize();
    animate();
    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    scene?.addEventListener("pointermove", sceneMove, { passive: true });
    scene?.addEventListener("pointerleave", sceneLeave);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      scene?.removeEventListener("pointermove", sceneMove);
      scene?.removeEventListener("pointerleave", sceneLeave);
    };
  }, []);

  return (
    <main className="um-page" id="top">
      <style>{styles}</style>
      <div ref={progressRef} className="um-scrollbar" />
      <div ref={cursorRef} className="um-cursor" />
      <canvas ref={canvasRef} className="um-particles" />
      <div className="um-noise" />

      <nav className="um-nav">
        <a href="#top" className="um-brand">
          <span className="um-brand-mark">H</span>
          <strong>HouseOfDev</strong>
        </a>
        <div className="um-nav-links">
          <a href="#services">Services</a>
          <a href="#explain">Explain</a>
          <a href="#motion3d">3D Motion</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="um-nav-cta" href="https://wa.me/918838401597" target="_blank" rel="noreferrer">
          WhatsApp Now
        </a>
      </nav>

      <section className="um-hero um-container">
        <div className="um-hero-grid">
          <div className="um-reveal">
            <p className="um-eyebrow"><span /> Websites • Dashboards • AI Automation</p>
            <h1>
              <span>HouseOfDev</span>
              that feels alive.
            </h1>
            <p className="um-lead">
              A premium interactive business website system for local brands — smooth motion, trust sections, lead funnels, booking flows,
              dashboards and WhatsApp-first conversion.
            </p>
            <div className="um-actions">
              <a href="#contact" className="um-button primary">Start a project <ArrowRight className="h-4 w-4" /></a>
              <a href="#work" className="um-button">View demo work</a>
            </div>
            <div className="um-stats">
              <div><b>7+</b><span>premium modules</span></div>
              <div><b>60</b><span>FPS motion target</span></div>
              <div><b>24h</b><span>lead flow</span></div>
            </div>
          </div>

          <div className="um-stage um-reveal">
            <div className="um-orbit-shell">
              <div className="um-ring one" />
              <div className="um-ring two" />
              <div className="um-ring three" />
              <div className="um-float code">&lt;/&gt;</div>
              <div className="um-float cube" />
              <div className="um-float pill">AI leads</div>
              <div className="um-float ring" />
              <div className="um-control-card">
                <div className="um-window"><strong>Live Business OS</strong><span><i /><i /><i /></span></div>
                <div className="um-command"><i /> build / capture-leads / automate-followup</div>
                <div className="um-dashboard-grid">
                  <div><span>Lead intent</span><b>84%</b><em /></div>
                  <div><span>Trust score</span><b>97</b><em className="green" /></div>
                </div>
                <div className="um-project-list">
                  <p><strong>Clinic website</strong><span>Demo ready</span></p>
                  <p><strong>Salon booking</strong><span>Funnel</span></p>
                  <p><strong>Gym lead system</strong><span>Automation</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="um-container um-section">
        <div className="um-section-head um-reveal">
          <h2>More objects. More motion. More premium.</h2>
          <p>The page now has layered shapes, moving particles, 3D hover cards, reactive light spots, smooth reveals and useful business sections — not random decoration.</p>
        </div>
        <div className="um-bento">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <article key={service.title} className={`um-card um-reveal ${index === 0 ? "large" : ""} ${index === 1 ? "tall" : ""}`}>
                <div className="um-icon"><Icon className="h-6 w-6" /></div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="um-tags">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </article>
            );
          })}
        </div>
        <div className="um-marquee um-reveal">
          <div>{["Websites", "Dashboards", "Booking Flow", "WhatsApp CTA", "Lead Forms", "AI Automation", "SEO Blocks", "Client Portal", "Websites", "Dashboards", "Booking Flow", "WhatsApp CTA", "Lead Forms", "AI Automation", "SEO Blocks", "Client Portal"].map((word, i) => <span key={`${word}-${i}`}>{word}</span>)}</div>
        </div>
      </section>

      <section id="explain" className="um-container um-section">
        <div className="um-section-head um-reveal">
          <h2>Explainable visuals, effects and animations.</h2>
          <p>Every glow, object and motion has a business reason: trust, attention, conversion and smooth user experience.</p>
        </div>
        <div className="um-explain-grid">
          <div className="um-visual-map um-reveal">
            <div className="um-mock-browser">
              <div className="um-mock-top"><i /><i /><i /></div>
              <div className="um-mock-hero"><b /><span /><small /><em /></div>
              <div className="um-mock-cards"><i /><i /><i /></div>
            </div>
            {explainItems.map((item, index) => (
              <button key={item.id} className={`um-hotspot h${index + 1}`} onClick={() => setActiveExplain(item)} onMouseEnter={() => setActiveExplain(item)}>
                {item.id}
              </button>
            ))}
          </div>
          <div className="um-explain-panel um-reveal">
            <p className="um-eyebrow"><span /> Tap / hover numbers on the image</p>
            <h3>{activeExplain.title}</h3>
            <p>{activeExplain.text}</p>
            <div className="um-effect-list">
              <div><Sparkles /><strong>Visual effect</strong><span>Glass panels, neon light and soft gradients create a luxury software-agency look.</span></div>
              <div><Zap /><strong>Client purpose</strong><span>The visitor understands fast: HouseOfDev builds websites, dashboards and automation systems.</span></div>
              <div><Rocket /><strong>Animation purpose</strong><span>Motion guides the eye from brand → proof → service → enquiry.</span></div>
              <div><Code2 /><strong>Developer note</strong><span>This is ready to become reusable Framer Motion components and hover states.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="motion3d" className="um-container um-section">
        <div className="um-section-head um-reveal">
          <h2>Multiple 3D objects + combined effects.</h2>
          <p>One scene combines 3D objects, mouse reaction, glow, parallax, particles, glass panels, orbit motion and AI-style dashboards.</p>
        </div>
        <div className="um-motion-grid">
          <div ref={sceneRef} className="um-scene3d um-reveal">
            <div className="um-scene-layer">
              <div className="um-orbit o1" /><div className="um-orbit o2" /><div className="um-orbit o3" />
              <div className="um-beam b1" /><div className="um-beam b2" /><div className="um-beam b3" />
              <div className="um-cube3d"><i /><i /><i /></div>
              <div className="um-sphere3d" />
              <div className="um-torus3d" />
              <div className="um-prism3d" />
              <div className="um-glass-dashboard">
                <div><strong>AI Lead System</strong><span>LIVE</span></div>
                <i style={{ "--w": "82%" } as React.CSSProperties} /><i style={{ "--w": "64%" } as React.CSSProperties} /><i style={{ "--w": "91%" } as React.CSSProperties} />
                <section><b>18<small>Leads</small></b><b>7<small>Calls</small></b><b>3<small>Booked</small></b></section>
              </div>
            </div>
          </div>
          <div className="um-effect-stack">
            {motionCards.map((card) => (
              <article key={card.title} className="um-combo-card um-reveal">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <div>{card.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
              </article>
            ))}
            <div className="um-recipe-board um-reveal">
              <div><b>01</b><span>Hook</span></div><div><b>02</b><span>Trust</span></div><div><b>03</b><span>Service</span></div><div><b>04</b><span>Proof</span></div><div><b>05</b><span>Lead</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="um-container um-section">
        <div className="um-section-head um-reveal"><h2>Demo work built for local businesses.</h2><p>Use these as samples when pitching clinics, restaurants, gyms, salons and service companies.</p></div>
        <div className="um-work-grid">
          {["Clinic appointment site", "Restaurant menu + leads", "Gym membership funnel", "Salon booking flow"].map((item) => (
            <article className="um-work-card um-reveal" key={item}><Layers3 /><strong>{item}</strong><span>Premium UI + WhatsApp conversion path</span></article>
          ))}
        </div>
      </section>

      <section id="pricing" className="um-container um-section">
        <div className="um-section-head um-reveal"><h2>Simple pricing to sell faster.</h2><p>Clear packages help local business owners understand what they are buying.</p></div>
        <div className="um-pricing">
          {pricing.map((plan) => (
            <article key={plan.name} className={`um-price-card um-reveal ${plan.featured ? "featured" : ""}`}>
              <h3>{plan.name}</h3><b>{plan.price}</b><p>{plan.text}</p>
              <ul>{plan.list.map((item) => <li key={item}><ShieldCheck className="h-4 w-4" />{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="um-container um-section">
        <div className="um-contact-grid">
          <div className="um-contact-panel um-reveal">
            <p className="um-eyebrow"><span /> Start with WhatsApp</p>
            <h2>Ready to make your business look premium online?</h2>
            <p>HouseOfDev builds websites, dashboards, client portals and AI automation systems for local businesses across India.</p>
            <a href="https://wa.me/918838401597" target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp: +91 88384 01597</a>
            <a href="mailto:arasanredt@gmail.com">arasanredt@gmail.com</a>
          </div>
          <form className="um-form um-reveal" onSubmit={(event) => event.preventDefault()}>
            <input required placeholder="Business name" />
            <div><input placeholder="Business type" /><input placeholder="Phone number" /></div>
            <select><option>Need a website</option><option>Need booking system</option><option>Need dashboard</option><option>Need AI automation</option></select>
            <textarea placeholder="Tell me what you want to build" />
            <button className="um-button primary" type="submit">Send enquiry <ArrowRight className="h-4 w-4" /></button>
          </form>
        </div>
      </section>

      <footer className="um-footer um-container"><strong>HouseOfDev</strong><span>Websites, dashboards and AI automation for local business.</span><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}

const styles = `
:root{--um-bg:#03040a;--um-bg2:#070a16;--um-panel:rgba(15,23,42,.66);--um-text:#f8fafc;--um-muted:#93a4ba;--um-line:rgba(148,163,184,.18);--um-cyan:#22d3ee;--um-violet:#8b5cf6;--um-pink:#ec4899;--um-lime:#a3e635;--mx:50%;--my:30%}
html{scroll-behavior:smooth;scroll-padding-top:110px}.um-page{min-height:100vh;background:#03040a;color:var(--um-text);font-family:var(--font-montserrat),Inter,system-ui,sans-serif;overflow:hidden;position:relative}.um-page::before{content:"";position:fixed;inset:0;z-index:0;background:radial-gradient(circle at var(--mx) var(--my),rgba(34,211,238,.22),transparent 23rem),radial-gradient(circle at 15% 13%,rgba(139,92,246,.22),transparent 28rem),radial-gradient(circle at 85% 16%,rgba(236,72,153,.16),transparent 28rem),linear-gradient(180deg,#02030a 0%,#070a16 46%,#02030a 100%)}.um-page::after{content:"";position:fixed;inset:0;z-index:0;background-image:linear-gradient(rgba(255,255,255,.038) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.038) 1px,transparent 1px);background-size:70px 70px;mask-image:radial-gradient(circle at 50% 25%,#000 0%,transparent 74%);opacity:.72;pointer-events:none}.um-container{width:min(1200px,calc(100% - 34px));margin-inline:auto;position:relative;z-index:2}.um-scrollbar{position:fixed;top:0;left:0;width:0%;height:3px;background:linear-gradient(90deg,var(--um-cyan),var(--um-violet),var(--um-pink),var(--um-lime));z-index:100;box-shadow:0 0 30px rgba(34,211,238,.65)}.um-noise{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.045;background-image:radial-gradient(circle,rgba(255,255,255,.35) 0 1px,transparent 1px);background-size:4px 4px}.um-cursor{position:fixed;width:24px;height:24px;border:1px solid rgba(34,211,238,.55);border-radius:999px;z-index:999;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:screen}.um-cursor::before{content:"";position:absolute;inset:-20px;border-radius:inherit;background:radial-gradient(circle,rgba(34,211,238,.22),transparent 70%);filter:blur(3px)}.um-particles{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.74}.um-nav{position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:40;width:min(1200px,calc(100% - 24px));height:74px;border:1px solid var(--um-line);border-radius:999px;background:rgba(3,5,14,.68);backdrop-filter:blur(26px);box-shadow:0 20px 80px rgba(0,0,0,.42);display:flex;align-items:center;justify-content:space-between;padding:0 13px 0 18px;overflow:hidden}.um-nav::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(34,211,238,.11),transparent);transform:translateX(-100%);animation:um-nav-scan 8s linear infinite}.um-brand{display:flex;align-items:center;gap:12px;font-weight:1000;letter-spacing:-.04em;position:relative;z-index:1}.um-brand-mark{width:45px;height:45px;border-radius:16px;background:conic-gradient(from 180deg,var(--um-cyan),var(--um-violet),var(--um-pink),var(--um-lime),var(--um-cyan));display:grid;place-items:center;box-shadow:0 0 36px rgba(34,211,238,.38);animation:um-logo-float 5.4s ease-in-out infinite}.um-brand-mark::before{content:"";width:34px;height:34px;border-radius:12px;background:#03040a;position:absolute}.um-brand-mark{color:white}.um-brand-mark{font-weight:1000}.um-nav-links{display:flex;gap:3px;position:relative;z-index:1}.um-nav-links a{padding:10px 13px;border-radius:999px;color:var(--um-muted);font-size:14px;font-weight:800;transition:.22s}.um-nav-links a:hover{color:white;background:rgba(255,255,255,.09)}.um-nav-cta,.um-button{position:relative;border:1px solid var(--um-line);border-radius:18px;background:rgba(255,255,255,.075);color:white;padding:16px 19px;font-weight:1000;display:inline-flex;align-items:center;gap:10px;transition:transform .22s,box-shadow .22s,border-color .22s;overflow:hidden}.um-nav-cta{border:0;border-radius:999px;padding:14px 18px;background:linear-gradient(135deg,var(--um-cyan),var(--um-violet));color:#020617;box-shadow:0 16px 42px rgba(34,211,238,.24)}.um-button.primary{border-color:transparent;background:linear-gradient(135deg,var(--um-cyan),var(--um-violet));color:#020617;box-shadow:0 20px 52px rgba(34,211,238,.22)}.um-button:hover{transform:translateY(-3px);border-color:rgba(34,211,238,.42);box-shadow:0 22px 55px rgba(34,211,238,.15)}.um-section{padding:112px 0}.um-hero{min-height:100vh;display:grid;align-items:center;padding-top:128px;padding-bottom:60px}.um-hero-grid{display:grid;grid-template-columns:1.02fr .98fr;gap:38px;align-items:center}.um-eyebrow{display:inline-flex;align-items:center;gap:10px;border:1px solid var(--um-line);border-radius:999px;background:rgba(255,255,255,.06);padding:9px 13px;color:#cbd5e1;font-size:13px;font-weight:900;box-shadow:inset 0 1px rgba(255,255,255,.08)}.um-eyebrow span{width:9px;height:9px;border-radius:50%;background:var(--um-lime);box-shadow:0 0 20px var(--um-lime);animation:um-pulse 1.5s ease-in-out infinite}.um-hero h1{font-size:clamp(50px,8vw,112px);line-height:.86;letter-spacing:-.09em;margin:22px 0 20px;background:linear-gradient(180deg,#fff 0%,#dbeafe 42%,#8aa4c9 76%,#475569 100%);-webkit-background-clip:text;background-clip:text;color:transparent}.um-hero h1 span{display:block;background:linear-gradient(90deg,var(--um-cyan),#fff,var(--um-violet),var(--um-pink));background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:um-text-flow 7s linear infinite}.um-lead{font-size:clamp(17px,2vw,21px);line-height:1.72;color:#cbd5e1;max-width:680px}.um-actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:32px}.um-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:34px;max-width:680px}.um-stats div{border:1px solid var(--um-line);border-radius:22px;background:rgba(255,255,255,.055);padding:15px;position:relative;overflow:hidden}.um-stats div::before{content:"";position:absolute;inset:auto -30% -65% -30%;height:90px;background:radial-gradient(circle,rgba(34,211,238,.23),transparent 65%)}.um-stats b{font-size:28px;letter-spacing:-.05em;position:relative}.um-stats span{display:block;color:var(--um-muted);font-size:12px;font-weight:800;margin-top:4px;position:relative}.um-stage{position:relative;min-height:590px;perspective:1200px}.um-orbit-shell{position:absolute;inset:16px;border:1px solid rgba(255,255,255,.08);border-radius:46px;background:linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.025));box-shadow:0 36px 110px rgba(0,0,0,.55);overflow:hidden;transform:rotateY(-10deg) rotateX(6deg);transition:.25s}.um-stage:hover .um-orbit-shell{transform:rotateY(-6deg) rotateX(3deg) translateY(-7px)}.um-orbit-shell::before{content:"";position:absolute;inset:-2px;background:conic-gradient(from 80deg,transparent,rgba(34,211,238,.32),transparent,rgba(139,92,246,.24),transparent);opacity:.75;filter:blur(25px)}.um-ring{position:absolute;border:1px dashed rgba(255,255,255,.17);border-radius:50%;animation:um-spin 18s linear infinite}.um-ring.one{inset:54px}.um-ring.two{inset:95px;animation-duration:26s;animation-direction:reverse}.um-ring.three{inset:142px;animation-duration:22s;opacity:.42}.um-float{position:absolute;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.075);backdrop-filter:blur(12px);box-shadow:0 18px 60px rgba(0,0,0,.25);display:grid;place-items:center;font-weight:1000;color:#e0f2fe}.um-float.code{top:70px;left:32px;width:126px;height:48px;border-radius:18px;color:var(--um-cyan);font-size:23px;animation:um-float-a 7s ease-in-out infinite}.um-float.cube{right:54px;top:64px;width:76px;height:76px;border-radius:22px;background:linear-gradient(135deg,rgba(34,211,238,.18),rgba(139,92,246,.18));animation:um-float-b 6.5s ease-in-out infinite}.um-float.cube::before{content:"";width:34px;height:34px;border-radius:9px;border:2px solid rgba(255,255,255,.55);transform:rotate(45deg)}.um-float.pill{left:20px;bottom:80px;width:150px;height:54px;border-radius:999px;animation:um-float-b 7.5s ease-in-out infinite reverse}.um-float.ring{right:28px;bottom:94px;width:92px;height:92px;border-radius:50%;animation:um-float-a 8s ease-in-out infinite reverse}.um-float.ring::before{content:"";width:54px;height:54px;border-radius:50%;border:10px solid rgba(236,72,153,.45);border-top-color:rgba(34,211,238,.9);animation:um-spin 5s linear infinite}.um-control-card{position:absolute;left:50%;top:51%;transform:translate(-50%,-50%);width:min(430px,84%);border:1px solid var(--um-line);border-radius:34px;background:rgba(3,7,18,.76);backdrop-filter:blur(24px);box-shadow:0 36px 110px rgba(0,0,0,.55);overflow:hidden}.um-window{display:flex;align-items:center;justify-content:space-between;padding:17px 18px;border-bottom:1px solid var(--um-line)}.um-window span{display:flex;gap:8px}.um-window i{width:11px;height:11px;border-radius:50%;display:block;background:#fb7185}.um-window i:nth-child(2){background:#fbbf24}.um-window i:nth-child(3){background:var(--um-lime)}.um-command{margin:18px;border:1px solid var(--um-line);background:rgba(255,255,255,.055);border-radius:20px;padding:14px;color:#cbd5e1;font-size:13px;display:flex;gap:10px;align-items:center}.um-command i{width:10px;height:10px;border-radius:50%;background:var(--um-cyan);box-shadow:0 0 18px var(--um-cyan)}.um-dashboard-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 18px}.um-dashboard-grid div{border:1px solid var(--um-line);border-radius:21px;background:rgba(255,255,255,.06);padding:15px}.um-dashboard-grid span{color:var(--um-muted);font-size:12px;font-weight:800}.um-dashboard-grid b{display:block;font-size:31px;letter-spacing:-.06em;margin-top:4px}.um-dashboard-grid em{display:block;height:9px;width:72%;border-radius:999px;background:linear-gradient(90deg,var(--um-cyan),var(--um-violet));margin-top:11px}.um-dashboard-grid em.green{width:88%;background:linear-gradient(90deg,var(--um-lime),var(--um-cyan))}.um-project-list{display:grid;gap:10px;margin:12px 18px 18px}.um-project-list p{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;border:1px solid var(--um-line);background:rgba(0,0,0,.18);border-radius:15px;margin:0}.um-project-list strong{font-size:14px}.um-project-list span{font-size:12px;padding:6px 9px;border-radius:999px;color:#d9f99d;background:rgba(163,230,53,.13)}.um-section-head{display:flex;justify-content:space-between;align-items:end;gap:26px;margin-bottom:36px}.um-section-head h2{font-size:clamp(34px,5.2vw,68px);line-height:.94;letter-spacing:-.075em;margin:0}.um-section-head p{max-width:550px;color:var(--um-muted);line-height:1.72;margin:0}.um-bento{display:grid;grid-template-columns:1.15fr .85fr 1fr;grid-auto-rows:minmax(240px,auto);gap:18px}.um-card{position:relative;border:1px solid var(--um-line);border-radius:28px;background:linear-gradient(180deg,rgba(255,255,255,.082),rgba(255,255,255,.036));box-shadow:0 24px 75px rgba(0,0,0,.25);padding:25px;overflow:hidden;transition:.24s}.um-card::before{content:"";position:absolute;inset:-1px;background:radial-gradient(circle at 50% 0%,rgba(34,211,238,.27),transparent 19rem);opacity:0;transition:.25s}.um-card:hover::before{opacity:1}.um-card:hover{transform:translateY(-8px);border-color:rgba(34,211,238,.38);box-shadow:0 28px 80px rgba(34,211,238,.08)}.um-card.large{grid-column:span 2}.um-card.tall{grid-row:span 2}.um-icon{width:56px;height:56px;border-radius:20px;display:grid;place-items:center;background:linear-gradient(135deg,rgba(34,211,238,.16),rgba(139,92,246,.12));border:1px solid rgba(34,211,238,.22);position:relative;z-index:1}.um-card h3{font-size:25px;letter-spacing:-.04em;margin:20px 0 10px;position:relative}.um-card p{color:var(--um-muted);line-height:1.72;position:relative}.um-tags{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px;position:relative}.um-tags span{font-size:12px;color:#cbd5e1;border:1px solid var(--um-line);padding:7px 10px;border-radius:999px;background:rgba(255,255,255,.055);font-weight:800}.um-marquee{margin:70px 0 0;border-block:1px solid var(--um-line);overflow:hidden;background:rgba(255,255,255,.035)}.um-marquee div{display:flex;width:max-content;animation:um-marquee 24s linear infinite}.um-marquee span{padding:18px 30px;color:#dbeafe;font-weight:1000}.um-marquee span::before{content:"✦";color:var(--um-cyan);margin-right:18px}.um-explain-grid,.um-motion-grid,.um-contact-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:22px;align-items:stretch}.um-visual-map,.um-explain-panel,.um-contact-panel,.um-form{position:relative;border:1px solid var(--um-line);border-radius:42px;background:linear-gradient(180deg,rgba(255,255,255,.085),rgba(255,255,255,.032));padding:28px;box-shadow:0 24px 80px rgba(0,0,0,.26);overflow:hidden}.um-visual-map{min-height:650px;background:radial-gradient(circle at 22% 18%,rgba(34,211,238,.18),transparent 26%),radial-gradient(circle at 80% 34%,rgba(236,72,153,.16),transparent 28%),linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.028))}.um-visual-map::before{content:"";position:absolute;inset:22px;border:1px solid rgba(255,255,255,.07);border-radius:34px;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:44px 44px;mask-image:linear-gradient(180deg,#000,transparent 90%)}.um-mock-browser{position:relative;z-index:1;margin:auto;width:min(480px,100%);border:1px solid rgba(255,255,255,.13);border-radius:30px;background:#050816;overflow:hidden;box-shadow:0 38px 110px rgba(0,0,0,.38);transform:rotate(-1.5deg)}.um-mock-top{height:42px;background:rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:8px;padding:0 16px}.um-mock-top i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.22)}.um-mock-hero{height:230px;padding:28px;background:radial-gradient(circle at 24% 30%,rgba(34,211,238,.42),transparent 32%),radial-gradient(circle at 80% 30%,rgba(139,92,246,.32),transparent 32%),linear-gradient(135deg,rgba(34,211,238,.12),rgba(139,92,246,.12));overflow:hidden;position:relative}.um-mock-hero::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 0 40%,rgba(255,255,255,.22) 48%,transparent 56%);animation:um-sheen 5s ease-in-out infinite}.um-mock-hero b{display:block;width:62%;height:26px;border-radius:999px;background:linear-gradient(90deg,#fff,#a5f3fc)}.um-mock-hero span,.um-mock-hero small{display:block;width:78%;height:12px;margin-top:18px;border-radius:999px;background:rgba(255,255,255,.18)}.um-mock-hero small{width:46%;margin-top:10px}.um-mock-hero em{display:block;width:140px;height:42px;border-radius:15px;margin-top:24px;background:linear-gradient(135deg,var(--um-cyan),var(--um-violet))}.um-mock-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:18px}.um-mock-cards i{height:92px;border:1px solid rgba(255,255,255,.09);border-radius:20px;background:rgba(255,255,255,.06)}.um-hotspot{position:absolute;z-index:3;width:34px;height:34px;border-radius:999px;border:1px solid rgba(34,211,238,.65);background:rgba(3,7,18,.72);box-shadow:0 0 0 8px rgba(34,211,238,.10),0 0 32px rgba(34,211,238,.35);display:grid;place-items:center;color:white;font-weight:1000;cursor:pointer;animation:um-hot 2.2s ease-in-out infinite}.um-hotspot.h1{left:11%;top:17%}.um-hotspot.h2{right:14%;top:32%}.um-hotspot.h3{left:16%;bottom:30%}.um-hotspot.h4{right:16%;bottom:20%}.um-hotspot.h5{left:49%;top:8%}.um-explain-panel h3{font-size:32px;line-height:1;letter-spacing:-.05em;margin:18px 0 12px}.um-explain-panel p{color:var(--um-muted);line-height:1.7}.um-effect-list{display:grid;gap:12px;margin-top:22px}.um-effect-list div{border:1px solid var(--um-line);border-radius:23px;padding:16px;background:rgba(255,255,255,.052);display:grid;grid-template-columns:44px 1fr;gap:13px;align-items:start}.um-effect-list svg{width:44px;height:44px;border-radius:16px;padding:11px;background:linear-gradient(135deg,rgba(34,211,238,.18),rgba(139,92,246,.14));border:1px solid rgba(34,211,238,.20)}.um-effect-list strong{display:block}.um-effect-list span{display:block;color:var(--um-muted);font-size:14px;line-height:1.55;margin-top:4px}.um-scene3d{min-height:710px;border:1px solid var(--um-line);border-radius:46px;background:linear-gradient(145deg,rgba(255,255,255,.082),rgba(255,255,255,.026));box-shadow:0 36px 110px rgba(0,0,0,.55);position:relative;overflow:hidden;perspective:1200px}.um-scene3d::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at var(--mx) var(--my),rgba(34,211,238,.18),transparent 20rem),linear-gradient(120deg,rgba(255,255,255,.08),transparent 30%,rgba(139,92,246,.08))}.um-scene-layer{position:absolute;inset:0;transform-style:preserve-3d;transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .16s ease-out}.um-orbit{position:absolute;left:50%;top:48%;border:1px solid rgba(255,255,255,.14);border-radius:50%;animation:um-orbit-spin 18s linear infinite;box-shadow:0 0 40px rgba(34,211,238,.08)}.um-orbit.o1{width:510px;height:190px;margin:-95px 0 0 -255px;transform:rotateX(65deg)}.um-orbit.o2{width:610px;height:260px;margin:-130px 0 0 -305px;transform:rotateX(72deg) rotateZ(24deg);animation-duration:25s}.um-orbit.o3{width:400px;height:400px;margin:-200px 0 0 -200px;transform:rotateY(64deg);animation-duration:22s;animation-direction:reverse}.um-cube3d{position:absolute;width:106px;height:106px;left:12%;top:17%;transform-style:preserve-3d;animation:um-combo-float 6s ease-in-out infinite}.um-cube3d i{position:absolute;inset:0;border:1px solid rgba(255,255,255,.24);background:linear-gradient(135deg,rgba(34,211,238,.36),rgba(139,92,246,.18));box-shadow:inset 0 0 28px rgba(255,255,255,.08)}.um-cube3d i:nth-child(1){transform:translateZ(53px)}.um-cube3d i:nth-child(2){transform:rotateY(90deg) translateZ(53px)}.um-cube3d i:nth-child(3){transform:rotateX(90deg) translateZ(53px)}.um-sphere3d{position:absolute;width:126px;height:126px;right:14%;top:18%;border-radius:50%;background:radial-gradient(circle at 32% 28%,#fff,rgba(34,211,238,.8) 18%,rgba(139,92,246,.35) 48%,rgba(2,6,23,.1) 70%);animation:um-sphere 5.8s ease-in-out infinite}.um-sphere3d::before{content:"";position:absolute;inset:-18px;border-radius:inherit;border:1px solid rgba(34,211,238,.24);animation:um-halo 2.8s ease-in-out infinite}.um-torus3d{position:absolute;width:160px;height:160px;left:56%;top:39%;border-radius:50%;border:22px solid rgba(34,211,238,.44);border-left-color:rgba(236,72,153,.62);border-bottom-color:rgba(139,92,246,.46);animation:um-torus 7.8s linear infinite}.um-prism3d{position:absolute;left:16%;bottom:17%;width:0;height:0;border-left:76px solid transparent;border-right:76px solid transparent;border-bottom:142px solid rgba(139,92,246,.54);filter:drop-shadow(0 0 38px rgba(139,92,246,.36));animation:um-prism 6.4s ease-in-out infinite}.um-glass-dashboard{position:absolute;left:50%;top:50%;width:min(430px,72%);min-height:270px;transform:translate(-50%,-50%) translateZ(110px);border:1px solid rgba(255,255,255,.16);border-radius:32px;background:rgba(2,6,23,.62);backdrop-filter:blur(24px);box-shadow:0 30px 95px rgba(0,0,0,.38);padding:22px;overflow:hidden}.um-glass-dashboard::before{content:"";position:absolute;inset:-40% -30%;background:linear-gradient(110deg,transparent,rgba(255,255,255,.18),transparent);animation:um-sweep 5.2s ease-in-out infinite}.um-glass-dashboard div{position:relative;display:flex;justify-content:space-between;gap:12px;font-weight:1000}.um-glass-dashboard div span{color:var(--um-lime);font-size:12px;border:1px solid rgba(163,230,53,.28);border-radius:999px;padding:6px 9px;background:rgba(163,230,53,.08)}.um-glass-dashboard>i{position:relative;display:block;height:13px;border-radius:999px;background:rgba(255,255,255,.10);overflow:hidden;margin-top:14px}.um-glass-dashboard>i::before{content:"";display:block;height:100%;width:var(--w);background:linear-gradient(90deg,var(--um-cyan),var(--um-violet),var(--um-pink));border-radius:inherit;animation:um-bar 4s ease-in-out infinite}.um-glass-dashboard section{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}.um-glass-dashboard section b{border:1px solid rgba(255,255,255,.10);border-radius:18px;padding:13px 10px;background:rgba(255,255,255,.055);font-size:22px}.um-glass-dashboard small{display:block;color:var(--um-muted);font-size:11px;margin-top:4px}.um-beam{position:absolute;height:2px;background:linear-gradient(90deg,transparent,var(--um-cyan),transparent);opacity:.42;filter:drop-shadow(0 0 12px var(--um-cyan));animation:um-beam 5s ease-in-out infinite}.um-beam.b1{width:54%;left:7%;top:37%;transform:rotate(18deg)}.um-beam.b2{width:48%;right:9%;top:64%;transform:rotate(-22deg);animation-delay:.9s}.um-beam.b3{width:40%;left:32%;top:20%;transform:rotate(-7deg);animation-delay:1.6s}.um-effect-stack{display:grid;gap:14px}.um-combo-card,.um-price-card,.um-work-card{border:1px solid var(--um-line);border-radius:28px;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.032));padding:20px;position:relative;overflow:hidden;transition:.25s}.um-combo-card:hover,.um-price-card:hover,.um-work-card:hover{transform:translateY(-6px);border-color:rgba(34,211,238,.34)}.um-combo-card h3{margin:0 0 9px;font-size:22px;letter-spacing:-.04em}.um-combo-card p{margin:0;color:var(--um-muted);line-height:1.65}.um-combo-card div{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px}.um-combo-card span{font-size:11px;font-weight:900;color:#dbeafe;border:1px solid rgba(255,255,255,.11);border-radius:999px;padding:7px 9px;background:rgba(255,255,255,.055)}.um-recipe-board{border:1px solid var(--um-line);border-radius:30px;background:rgba(255,255,255,.045);padding:20px;display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.um-recipe-board div{border:1px solid rgba(255,255,255,.10);border-radius:20px;padding:13px;background:rgba(2,6,23,.32);text-align:center}.um-recipe-board span{display:block;color:var(--um-muted);font-size:12px;margin-top:5px}.um-work-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.um-work-card{min-height:190px;display:grid;align-content:start;gap:14px}.um-work-card svg{color:var(--um-cyan);filter:drop-shadow(0 0 16px rgba(34,211,238,.6))}.um-work-card strong{font-size:20px;line-height:1.1}.um-work-card span{color:var(--um-muted);line-height:1.55}.um-pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.um-price-card.featured{border-color:rgba(34,211,238,.48);background:linear-gradient(180deg,rgba(34,211,238,.12),rgba(139,92,246,.062));transform:translateY(-10px)}.um-price-card h3{font-size:24px}.um-price-card>b{display:block;font-size:45px;font-weight:1000;letter-spacing:-.06em;margin:18px 0}.um-price-card p{color:var(--um-muted)}.um-price-card ul{padding:0;margin:19px 0 0;list-style:none}.um-price-card li{padding:11px 0;color:#cbd5e1;border-bottom:1px solid var(--um-line);display:flex;gap:10px;align-items:center}.um-contact-panel h2{font-size:clamp(34px,5vw,62px);line-height:.92;letter-spacing:-.07em;margin:18px 0}.um-contact-panel p{color:var(--um-muted);line-height:1.7}.um-contact-panel a{display:flex;align-items:center;gap:10px;border:1px solid var(--um-line);border-radius:18px;padding:14px;background:rgba(255,255,255,.052);font-weight:900;margin-top:12px}.um-form{display:grid;gap:14px}.um-form input,.um-form select,.um-form textarea{width:100%;border:1px solid var(--um-line);border-radius:18px;background:rgba(255,255,255,.062);color:white;padding:16px;outline:none}.um-form input:focus,.um-form select:focus,.um-form textarea:focus{border-color:rgba(34,211,238,.58);box-shadow:0 0 0 4px rgba(34,211,238,.11)}.um-form textarea{min-height:135px;resize:vertical}.um-form div{display:grid;grid-template-columns:1fr 1fr;gap:14px}.um-footer{border-top:1px solid var(--um-line);padding:40px 0;color:var(--um-muted);display:flex;justify-content:space-between;gap:18px;align-items:center}.um-footer a{border:1px solid var(--um-line);border-radius:999px;padding:11px 14px;background:rgba(255,255,255,.06);font-weight:900;color:white}.um-reveal{opacity:0;transform:translateY(26px) scale(.985);transition:opacity .75s,transform .75s}.um-reveal.is-visible{opacity:1;transform:none}@keyframes um-nav-scan{to{transform:translateX(100%)}}@keyframes um-logo-float{50%{transform:translateY(-5px) rotate(8deg)}}@keyframes um-pulse{50%{transform:scale(1.45);opacity:.65}}@keyframes um-text-flow{to{background-position:250% 0}}@keyframes um-spin{to{transform:rotate(360deg)}}@keyframes um-float-a{50%{transform:translate3d(20px,-22px,0)}}@keyframes um-float-b{50%{transform:translate3d(-18px,18px,0) rotate(5deg)}}@keyframes um-marquee{to{transform:translateX(-50%)}}@keyframes um-sheen{0%,35%{transform:translateX(-110%)}70%,100%{transform:translateX(110%)}}@keyframes um-hot{50%{transform:scale(1.08)}}@keyframes um-orbit-spin{to{rotate:360deg}}@keyframes um-combo-float{0%,100%{transform:rotateX(58deg) rotateY(-26deg) rotateZ(8deg) translateZ(0)}50%{transform:rotateX(72deg) rotateY(24deg) rotateZ(28deg) translate3d(20px,-22px,80px)}}@keyframes um-sphere{50%{transform:translate3d(-24px,18px,120px) scale(1.08)}}@keyframes um-halo{50%{transform:scale(1.18);opacity:.45}}@keyframes um-torus{to{transform:rotateX(360deg) rotateY(220deg) rotateZ(360deg)}}@keyframes um-prism{50%{transform:rotateY(32deg) rotateX(-10deg) translate3d(16px,-24px,110px)}}@keyframes um-sweep{0%,36%{transform:translateX(-100%) rotate(18deg)}66%,100%{transform:translateX(100%) rotate(18deg)}}@keyframes um-bar{50%{filter:hue-rotate(70deg)}}@keyframes um-beam{50%{opacity:.62;transform:translateX(18px)}}@media(max-width:980px){.um-nav-links{display:none}.um-hero-grid,.um-explain-grid,.um-motion-grid,.um-contact-grid{grid-template-columns:1fr}.um-stage{min-height:540px}.um-stats,.um-pricing{grid-template-columns:1fr}.um-bento{grid-template-columns:1fr}.um-card.large,.um-card.tall{grid-column:auto;grid-row:auto}.um-section-head{display:block}.um-section-head p{margin-top:14px}.um-price-card.featured{transform:none}.um-work-grid{grid-template-columns:repeat(2,1fr)}.um-form div{grid-template-columns:1fr}.um-footer{display:block}.um-footer a{display:inline-block;margin-top:14px}.um-cursor{display:none}.um-section{padding:82px 0}.um-recipe-board{grid-template-columns:1fr 1fr}}@media(max-width:620px){.um-brand strong{display:none}.um-nav-cta{font-size:12px;padding:12px 13px}.um-hero{padding-top:110px}.um-stats,.um-work-grid,.um-recipe-board,.um-mock-cards{grid-template-columns:1fr}.um-scene3d{min-height:620px}.um-glass-dashboard{width:84%}.um-visual-map{min-height:560px}.um-hotspot.h1{left:7%;top:14%}.um-hotspot.h2{right:8%;top:28%}.um-hotspot.h3{left:8%;bottom:32%}.um-hotspot.h4{right:8%;bottom:18%}.um-cube3d{left:8%;top:14%;scale:.82}.um-sphere3d{right:6%;top:16%;scale:.82}.um-torus3d{left:48%;top:42%;scale:.75}}
`;
