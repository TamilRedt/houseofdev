export const profile = {
  name: "Tamilarasan",
  role: "Web Developer & AI Automation Builder",
  brand: "HouseOfDev",
  email: "arasanredt@gmail.com",
  resumePath: "/tamilarasan-resume.txt",
  heroImage: "/tamilarasan-chair.png",
  portraitImage: "/tamilarasan-standing.png",
};

export const navLinks = [
  { label: "Index", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
] as const;

export const socials = [
  { label: "gh", name: "GitHub", href: "#contact" },
  { label: "li", name: "LinkedIn", href: "#contact" },
  { label: "em", name: "Email", href: "mailto:arasanredt@gmail.com" },
];

export const expertise = [
  "Website Development",
  "Business Dashboards",
  "AI Automation",
  "Supabase Systems",
  "Client Portals",
  "Vercel Deployment",
];

export const proofLogos = [
  "HouseOfDev",
  "Clinic Demo",
  "Automation Lab",
  "Client Portal",
  "Local Business",
  "Your Brand",
];

export const traits = [
  "Practical builder",
  "Fast learner",
  "Problem solver",
  "Business-focused developer",
  "AI automation builder",
];

export const skills = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Supabase",
  "PostgreSQL",
  "GitHub",
  "Vercel",
  "AI Tools",
  "Automation",
  "API Integrations",
];

export type PortfolioProject = {
  name: string;
  description: string;
  techStack: string[];
  accent: string;
  mockupLabel: string;
  year: string;
  role: string;
  type: string;
};

export const projects: PortfolioProject[] = [
  {
    name: "HouseOfDev",
    description:
      "A business website and digital service platform for helping local businesses come online.",
    techStack: ["Next.js", "Tailwind CSS", "Supabase", "Vercel"],
    accent: "from-cyan-400 to-blue-500",
    mockupLabel: "Business service platform",
    year: "2026",
    role: "Founder / Developer",
    type: "Brand platform",
  },
  {
    name: "Sudersan Clinic Demo",
    description:
      "A premium healthcare website concept for a local clinic with service sections, trust elements, and contact flow.",
    techStack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    accent: "from-emerald-300 to-cyan-500",
    mockupLabel: "Clinic trust and booking flow",
    year: "2026",
    role: "Designer / Developer",
    type: "Healthcare website",
  },
  {
    name: "AI Automation Agent",
    description:
      "A concept automation system for email, WhatsApp, job applications, and repetitive business workflows.",
    techStack: ["AI Tools", "Automation", "API Integrations"],
    accent: "from-violet-400 to-fuchsia-500",
    mockupLabel: "Automation command center",
    year: "2026",
    role: "Automation Builder",
    type: "Workflow concept",
  },
  {
    name: "Client Dashboard System",
    description:
      "A dashboard concept for tracking client projects, project status updates, and admin-side progress management.",
    techStack: ["Supabase", "PostgreSQL", "Next.js"],
    accent: "from-blue-400 to-emerald-400",
    mockupLabel: "Client progress dashboard",
    year: "2026",
    role: "Full-stack Developer",
    type: "Dashboard system",
  },
];

export type Service = {
  icon: string;
  title: string;
  description: string;
};

export const services: Service[] = [
  {
    icon: "Globe2",
    title: "Website Development",
    description: "Fast, responsive websites that make a business look trustworthy online.",
  },
  {
    icon: "PenTool",
    title: "Landing Page Design",
    description: "Focused pages built to explain, convert, and capture qualified leads.",
  },
  {
    icon: "Building2",
    title: "Business Website Setup",
    description: "Domain, hosting, pages, contact flow, analytics, and launch essentials.",
  },
  {
    icon: "ChartNoAxesCombined",
    title: "Admin Dashboard",
    description: "Internal panels for tracking customers, projects, status, and operations.",
  },
  {
    icon: "Handshake",
    title: "Client Portal",
    description: "Secure client views for project updates, files, requests, and trust.",
  },
  {
    icon: "Bot",
    title: "AI Automation",
    description: "AI-assisted workflows for repetitive tasks, replies, routing, and follow-ups.",
  },
  {
    icon: "ServerCog",
    title: "Supabase Setup",
    description: "Database, auth, tables, policies, and backend-ready app foundations.",
  },
  {
    icon: "CloudUpload",
    title: "Vercel Deployment",
    description: "Clean production deployments with speed, previews, and reliable delivery.",
  },
];

export const resumeHighlights = [
  {
    title: "Skills Summary",
    items: ["Frontend development", "Responsive UI", "Supabase systems", "Automation workflows"],
  },
  {
    title: "Project Experience",
    items: ["HouseOfDev", "Sudersan Clinic Demo", "AI Automation Agent", "Client Dashboard System"],
  },
  {
    title: "Education",
    items: ["Education details placeholder", "Continuous self-learning in web and AI tools"],
  },
  {
    title: "Freelance / Self-Built",
    items: ["Business websites", "Dashboard concepts", "Digital service systems", "Deployment workflows"],
  },
];
