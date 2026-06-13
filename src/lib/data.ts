import { slugify } from "@/lib/utils";

export type FAQ = {
  question: string;
  answer: string;
};

export type Service = {
  slug: string;
  title: string;
  icon: string;
  description: string;
  benefits: string[];
  process: string[];
  faq: FAQ[];
  cta: string;
};

export type Industry = {
  slug: string;
  title: string;
  description: string;
  challenges: string[];
  solutions: string[];
  caseStudy: string;
};

export type Solution = {
  slug: string;
  title: string;
  icon: string;
  description: string;
  modules: string[];
  outcomes: string[];
};

export type PortfolioProject = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  goals: string[];
  features: string[];
  technologies: string[];
  results: string[];
  palette: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  author: string;
  body: string[];
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Solutions", href: "/solutions" },
  { label: "Projects", href: "/projects" },
  { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

const commonFaq = (service: string): FAQ[] => [
  {
    question: `How long does ${service.toLowerCase()} take?`,
    answer:
      "Most engagements start with a strategy sprint, followed by weekly delivery milestones. Smaller builds can launch in 7 to 14 days, while custom platforms are planned in phases.",
  },
  {
    question: "Can HouseOfDev manage everything after launch?",
    answer:
      "Yes. Hosting, monitoring, performance tuning, content updates, analytics, backups, SEO improvements, and support can be bundled into a maintenance plan.",
  },
  {
    question: "Do you work with existing websites or only new builds?",
    answer:
      "Both. We can modernize an existing digital property, rebuild it on Next.js, or design a new system from the ground up.",
  },
];

const serviceDescriptions: Array<Omit<Service, "slug" | "benefits" | "process" | "faq" | "cta">> = [
  {
    title: "Business Website Development",
    icon: "Globe2",
    description:
      "High-converting websites for local businesses that need credibility, mobile speed, WhatsApp-ready contact flows, and strong local SEO.",
  },
  {
    title: "Corporate Website Development",
    icon: "Building2",
    description:
      "Enterprise-grade websites with polished storytelling, leadership content, case studies, governance pages, and scalable content architecture.",
  },
  {
    title: "E-Commerce Development",
    icon: "ShoppingCart",
    description:
      "Fast storefronts with product catalogs, checkout flows, inventory integrations, payment setup, analytics, and conversion-focused UX.",
  },
  {
    title: "Web Application Development",
    icon: "PanelsTopLeft",
    description:
      "Custom web apps for booking, operations, customer portals, dashboards, workflow automation, and business-critical internal tools.",
  },
  {
    title: "Custom Software Solutions",
    icon: "Code2",
    description:
      "Purpose-built systems that replace spreadsheets, manual follow-ups, fragmented tools, and slow business processes.",
  },
  {
    title: "Cloud Solutions",
    icon: "Cloud",
    description:
      "Cloud-native architecture, managed hosting, backups, observability, scaling plans, and secure infrastructure for growing teams.",
  },
  {
    title: "AWS Infrastructure Setup",
    icon: "ServerCog",
    description:
      "AWS environments designed for reliability, cost awareness, secure access, automated deployments, logging, and disaster recovery.",
  },
  {
    title: "AI Chatbot Development",
    icon: "Bot",
    description:
      "AI assistants for lead capture, customer support, internal knowledge, appointment booking, FAQs, and guided sales conversations.",
  },
  {
    title: "Business Automation",
    icon: "Workflow",
    description:
      "Automated workflows for approvals, follow-ups, lead routing, reporting, reminders, task creation, and cross-tool synchronization.",
  },
  {
    title: "CRM Solutions",
    icon: "UsersRound",
    description:
      "Sales and service CRMs with pipelines, activity history, customer segmentation, reminders, and management reporting.",
  },
  {
    title: "SEO Optimization",
    icon: "Search",
    description:
      "Technical SEO, structured data, content architecture, page speed, local SEO, and keyword-driven landing pages.",
  },
  {
    title: "Digital Marketing",
    icon: "Megaphone",
    description:
      "Campaign strategy, landing pages, analytics, conversion tracking, creative systems, and growth experiments.",
  },
  {
    title: "UI/UX Design",
    icon: "PenTool",
    description:
      "Product design, website experience design, design systems, wireframes, prototypes, and conversion-focused interaction patterns.",
  },
  {
    title: "Website Maintenance",
    icon: "Wrench",
    description:
      "Managed updates, uptime checks, bug fixes, security patches, content changes, monthly reports, and performance reviews.",
  },
  {
    title: "Hosting & Domain Management",
    icon: "Network",
    description:
      "Domain setup, DNS, SSL, hosting configuration, migrations, backup planning, uptime checks, and launch coordination.",
  },
  {
    title: "Security Audits",
    icon: "ShieldCheck",
    description:
      "Security reviews for websites, apps, APIs, forms, dashboards, credentials, access controls, and deployment posture.",
  },
  {
    title: "Performance Optimization",
    icon: "Gauge",
    description:
      "Core Web Vitals tuning, image optimization, caching, code splitting, accessibility, and conversion-critical speed work.",
  },
  {
    title: "API Development",
    icon: "Braces",
    description:
      "Secure REST and integration APIs for payments, CRMs, ERPs, booking tools, mobile apps, and business automation.",
  },
];

export const services: Service[] = serviceDescriptions.map((service) => ({
  ...service,
  slug: slugify(service.title),
  benefits: [
    "Professional brand trust across mobile and desktop",
    "Clear conversion paths for leads, bookings, and sales",
    "Scalable architecture built for future integrations",
    "Analytics-ready delivery with measurable outcomes",
  ],
  process: [
    "Discovery and business goal mapping",
    "Experience architecture and interface design",
    "Next.js production build with SEO and performance checks",
    "Launch, monitoring, documentation, and support handover",
  ],
  faq: commonFaq(service.title),
  cta: `Discuss ${service.title}`,
}));

const industryNames = [
  "Healthcare",
  "Clinics",
  "Hospitals",
  "Restaurants",
  "Cafes",
  "Educational Institutions",
  "Schools",
  "Colleges",
  "Construction Companies",
  "Real Estate",
  "Manufacturing",
  "Retail Businesses",
  "Professional Services",
  "Startups",
  "Technology Companies",
];

export const industries: Industry[] = industryNames.map((title) => ({
  slug: slugify(title),
  title,
  description: `${title} need digital systems that earn trust quickly, simplify daily operations, and convert attention into appointments, orders, inquiries, or retained customers.`,
  challenges: [
    "Low online visibility and inconsistent lead quality",
    "Manual coordination across calls, messages, and spreadsheets",
    "Outdated websites that do not reflect the quality of the business",
    "No single dashboard for customer, project, and performance data",
  ],
  solutions: [
    "Premium website with local SEO and conversion-focused pages",
    "Booking, inquiry, catalog, or quotation workflows",
    "Automated follow-ups, notifications, and CRM handoff",
    "Analytics dashboard with business-specific KPIs",
  ],
  caseStudy:
    "A focused digital build can combine a modern public website with a simple operations layer, reducing manual follow-up while increasing qualified inquiries.",
}));

export const solutions: Solution[] = [
  {
    title: "Digital Transformation",
    icon: "Sparkles",
    description:
      "Modernize your brand, workflows, customer experience, and internal systems in a practical staged roadmap.",
    modules: ["Digital audit", "Roadmap", "Customer experience", "Automation backlog"],
    outcomes: ["Clear technology direction", "Faster service delivery", "Better customer visibility"],
  },
  {
    title: "Business Automation",
    icon: "Workflow",
    description:
      "Replace repetitive manual coordination with automated approvals, notifications, assignments, and reports.",
    modules: ["Lead routing", "Task automation", "Approval flows", "Reporting"],
    outcomes: ["Reduced admin load", "Fewer missed follow-ups", "Predictable operations"],
  },
  {
    title: "Cloud Migration",
    icon: "CloudUpload",
    description:
      "Move apps, databases, files, and workflows into reliable cloud infrastructure with security and backup planning.",
    modules: ["Architecture", "Migration", "Backups", "Monitoring"],
    outcomes: ["Improved uptime", "Scalable infrastructure", "Lower operational risk"],
  },
  {
    title: "AI Integration",
    icon: "BrainCircuit",
    description:
      "Add AI chat, document search, internal assistants, summarization, and smart triage to everyday workflows.",
    modules: ["AI chatbot", "Knowledge base", "Prompt systems", "Human handoff"],
    outcomes: ["Quicker responses", "Better self-service", "Higher team productivity"],
  },
  {
    title: "Enterprise Software",
    icon: "Layers3",
    description:
      "Custom platforms for organizations that need role-based access, reporting, workflows, and integrations.",
    modules: ["RBAC", "Dashboards", "Audit logs", "API integrations"],
    outcomes: ["Centralized operations", "Secure data access", "Scalable process control"],
  },
  {
    title: "Online Booking Systems",
    icon: "CalendarCheck",
    description:
      "Appointment, consultation, visit, or table booking workflows with reminders and admin management.",
    modules: ["Availability", "Payments", "Reminders", "Admin calendar"],
    outcomes: ["Fewer phone calls", "Higher booking completion", "Cleaner schedules"],
  },
  {
    title: "Inventory Management",
    icon: "Boxes",
    description:
      "Track stock, vendors, low-stock alerts, orders, and movement across stores or departments.",
    modules: ["Stock ledger", "Vendor records", "Alerts", "Reports"],
    outcomes: ["Better stock control", "Reduced leakage", "Faster decisions"],
  },
  {
    title: "HR Management Systems",
    icon: "UserRoundCog",
    description:
      "Employee records, onboarding, leave, documents, performance, policies, and HR reporting.",
    modules: ["Profiles", "Documents", "Leave", "Performance"],
    outcomes: ["Organized HR data", "Simpler approvals", "Better compliance"],
  },
  {
    title: "Attendance Systems",
    icon: "Clock3",
    description:
      "Attendance, shifts, timesheets, approvals, reports, and manager review workflows.",
    modules: ["Punch logs", "Shift rules", "Timesheets", "Reports"],
    outcomes: ["Cleaner payroll inputs", "Transparent attendance", "Less manual checking"],
  },
  {
    title: "Customer Portals",
    icon: "Handshake",
    description:
      "Secure customer-facing dashboards for projects, invoices, files, communication, and support.",
    modules: ["Login", "Project status", "Files", "Tickets"],
    outcomes: ["Higher trust", "Less status chasing", "Centralized communication"],
  },
  {
    title: "Client Dashboards",
    icon: "ChartNoAxesCombined",
    description:
      "Executive dashboards that turn operational data into metrics, trends, alerts, and decisions.",
    modules: ["KPIs", "Charts", "Filters", "Exports"],
    outcomes: ["Better visibility", "Faster reporting", "Data-backed decisions"],
  },
].map((solution) => ({ ...solution, slug: slugify(solution.title) }));

export const portfolioProjects: PortfolioProject[] = [
  {
    title: "Clinic Booking System",
    slug: "clinic-booking-system",
    category: "Editable sample / Healthcare",
    summary:
      "An editable sample showing how a local clinic can move appointments, service pages, and patient questions into one online workflow.",
    goals: ["Present services clearly", "Collect appointment requests", "Prepare local search foundations"],
    features: ["Doctor and service sections", "Appointment request form", "WhatsApp handoff", "Local business schema"],
    technologies: ["Next.js", "Supabase", "Server Actions", "Structured Data"],
    results: ["Replace with live booking metrics after launch", "Designed to reduce phone coordination", "Structured for mobile-first patient discovery"],
    palette: "from-emerald-500 to-cyan-500",
  },
  {
    title: "Restaurant Order Flow",
    slug: "restaurant-order-flow",
    category: "Editable sample / Restaurant",
    summary:
      "A restaurant concept for menu discovery, table requests, offer pages, and WhatsApp-ready customer conversations.",
    goals: ["Showcase menu and ambience", "Collect table inquiries", "Publish offer landing pages"],
    features: ["Digital menu", "Booking request form", "Offer sections", "Review-ready content blocks"],
    technologies: ["Next.js", "React Hook Form", "Zod", "Analytics"],
    results: ["Replace with live booking data after launch", "Built for faster menu discovery", "Prepared for campaign tracking"],
    palette: "from-amber-500 to-rose-500",
  },
  {
    title: "Project Lead Tracker",
    slug: "project-lead-tracker",
    category: "Editable sample / Construction",
    summary:
      "A construction and service-business concept for project proof, inquiry qualification, and internal lead follow-up.",
    goals: ["Present completed work", "Capture project inquiries", "Qualify leads before calls"],
    features: ["Project gallery structure", "Inquiry qualification", "Timeline module", "Service pages"],
    technologies: ["Next.js", "PostgreSQL", "AWS", "SEO"],
    results: ["Replace with live lead-quality notes after launch", "Designed to improve proposal preparation", "Organized around proof and next actions"],
    palette: "from-slate-700 to-blue-500",
  },
  {
    title: "Training Centre Portal",
    slug: "training-centre-portal",
    category: "Editable sample / Education",
    summary:
      "An education concept for course discovery, admissions questions, enquiry capture, and parent-friendly trust content.",
    goals: ["Explain courses clearly", "Collect admissions inquiries", "Prepare content for search"],
    features: ["Program pages", "Admissions forms", "Story sections", "SEO blog structure"],
    technologies: ["Next.js", "Supabase", "Open Graph", "Server Actions"],
    results: ["Replace with live admissions data after launch", "Designed for simpler inquiry follow-up", "Prepared for course-level SEO"],
    palette: "from-indigo-500 to-sky-500",
  },
  {
    title: "Business Automation Hub",
    slug: "business-automation-hub",
    category: "Editable sample / Automation",
    summary:
      "A sample operating hub for service businesses that need lead intake, task tracking, client updates, and AI-assisted workflow automation.",
    goals: ["Centralize lead intake", "Track operational tasks", "Prepare AI-assisted workflows"],
    features: ["Dashboard concept", "Lead pipeline", "Automation rules", "Client portal structure"],
    technologies: ["Next.js", "Framer Motion", "Supabase", "Vercel"],
    results: ["Replace with live workflow data after launch", "Designed for clearer daily operations", "Ready for Supabase-backed implementation"],
    palette: "from-blue-600 to-emerald-500",
  },
];

export const pricingPackages = [
  {
    name: "Starter Website",
    price: "INR 4,999",
    description: "A focused online launch package for businesses that need a polished first presence.",
    features: ["5 pages", "Mobile responsive", "WhatsApp integration", "Contact form", "Basic SEO"],
  },
  {
    name: "Business Website",
    price: "INR 9,999",
    description: "A stronger business website with richer content, analytics, and speed-focused delivery.",
    featured: true,
    features: ["10 pages", "Advanced design", "SEO setup", "Analytics", "Blog", "Speed optimization"],
  },
  {
    name: "Premium Solution",
    price: "INR 24,999+",
    description: "A custom platform package for portals, booking systems, automation, databases, and AI.",
    features: ["Custom features", "Admin dashboard", "Database", "Booking system", "Automation", "AI integration"],
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "why-local-businesses-need-a-fast-website",
    title: "Why Local Businesses Need a Fast Website Before They Buy More Ads",
    excerpt:
      "A slow or unclear website quietly wastes ad spend. Here is what to fix first for better leads.",
    category: "Business Growth",
    tags: ["Local SEO", "Performance", "Web Development"],
    date: "2026-05-18",
    readTime: "6 min read",
    author: "HouseOfDev Strategy Team",
    body: [
      "Many local businesses try to solve weak lead flow with more ads, but the website is often the first bottleneck. If pages load slowly, services are unclear, or contact options are buried, paid traffic becomes expensive noise.",
      "The strongest first move is a simple conversion audit: speed, mobile usability, service clarity, proof, local schema, and contact friction. These upgrades compound because every future campaign performs against a better destination.",
      "A premium website does not need to be bloated. It needs clear information architecture, fast assets, trust signals, and a path from visitor intent to inquiry in as few steps as possible.",
    ],
  },
  {
    slug: "ai-chatbots-for-clinics-restaurants-and-consultants",
    title: "AI Chatbots for Clinics, Restaurants, and Consultants",
    excerpt:
      "Practical ways small teams can use AI assistants without losing the human warmth customers expect.",
    category: "AI",
    tags: ["AI", "Automation", "Customer Support"],
    date: "2026-04-30",
    readTime: "7 min read",
    author: "HouseOfDev AI Studio",
    body: [
      "The best AI chatbot projects begin with a narrow job: answer repeat questions, collect inquiry details, book appointments, or summarize support issues for a human team. That keeps the system useful from day one.",
      "For clinics, the assistant can collect appointment intent and share operating hours. For restaurants, it can handle menu and table questions. For consultants, it can qualify leads before scheduling a call.",
      "The production standard is simple: clear escalation, safe boundaries, analytics, and human review for sensitive workflows.",
    ],
  },
  {
    slug: "seo-foundation-for-business-websites-in-india",
    title: "SEO Foundation for Business Websites in India",
    excerpt:
      "The technical and content basics that help Indian businesses compete in local and service searches.",
    category: "SEO",
    tags: ["SEO", "Schema", "India"],
    date: "2026-03-12",
    readTime: "5 min read",
    author: "HouseOfDev SEO Team",
    body: [
      "SEO starts with crawlable structure, clean metadata, local business schema, fast rendering, and relevant service pages. These basics are often more valuable than publishing dozens of unfocused articles.",
      "Location intent matters. A business targeting Hosur, Bangalore, or nearby industrial regions should make service coverage explicit without stuffing keywords into every heading.",
      "Search performance improves when technical quality and useful content work together: speed, structured data, internal links, and pages that answer real buying questions.",
    ],
  },
  {
    slug: "cloud-readiness-checklist-for-growing-teams",
    title: "Cloud Readiness Checklist for Growing Teams",
    excerpt:
      "A practical checklist for moving from fragile hosting to reliable cloud infrastructure.",
    category: "Cloud Computing",
    tags: ["AWS", "Cloud", "Security"],
    date: "2026-02-22",
    readTime: "8 min read",
    author: "HouseOfDev Cloud Team",
    body: [
      "Cloud migration should be boring in the best way. Inventory systems, define environments, protect secrets, add backups, set alerts, and plan rollback before moving production traffic.",
      "Most small teams do not need complex infrastructure at the start. They need a clean baseline: managed database, secure storage, reliable deployments, uptime monitoring, and cost visibility.",
      "The right architecture grows with the business instead of forcing a rebuild every time traffic, team size, or operational complexity increases.",
    ],
  },
];

export const blogCategories = [
  "All",
  "Web Development",
  "Business Growth",
  "AI",
  "SEO",
  "Cloud Computing",
  "Automation",
  "Startups",
];

export const jobs = [
  {
    title: "Frontend Developer Intern",
    type: "Internship",
    location: "Remote / Hosur",
    description: "Build polished Next.js interfaces, reusable components, and conversion-focused pages.",
  },
  {
    title: "Full Stack Developer",
    type: "Full-time",
    location: "Hybrid",
    description: "Work across Next.js, Supabase, PostgreSQL, server actions, and dashboard features.",
  },
  {
    title: "Digital Growth Executive",
    type: "Full-time",
    location: "Remote",
    description: "Support SEO, content strategy, analytics reporting, and campaign coordination.",
  },
];

export const stats = [
  { label: "Core Services", value: 18, suffix: "" },
  { label: "Industry Playbooks", value: 15, suffix: "" },
  { label: "Stack Tools", value: 11, suffix: "" },
  { label: "Editable Concepts", value: 5, suffix: "" },
];

export const technologyStack = [
  "Next.js 16",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "PostgreSQL",
  "Supabase",
  "AWS",
  "Vercel",
  "React Hook Form",
  "Zod",
  "Server Actions",
];

export const keywords = [
  "Website Development Company",
  "Web Design Agency",
  "Website Developer Bangalore",
  "Website Development Hosur",
  "Digital Agency India",
  "Business Website Development",
];

