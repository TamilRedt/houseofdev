import { getSupabaseAdmin } from "@/lib/supabase";

export type HomePackage = {
  name: string;
  slug: string;
  description: string;
  priceOneTime: number;
  priceMonthly: number;
  features: string[];
  isPopular: boolean;
};

export type HomeDemoProject = {
  title: string;
  slug: string;
  businessType: string;
  description: string;
  imageUrl: string | null;
  demoUrl: string | null;
  features: string[];
};

export type HomeTestimonial = {
  name: string;
  businessName: string | null;
  message: string;
  rating: number;
};

export type HomeContent = {
  packages: HomePackage[];
  demoProjects: HomeDemoProject[];
  testimonials: HomeTestimonial[];
};

const fallbackPackages: HomePackage[] = [
  {
    name: "Starter",
    slug: "starter",
    description: "Best for small businesses needing a basic online presence.",
    priceOneTime: 4999,
    priceMonthly: 999,
    isPopular: false,
    features: ["1-3 pages", "Mobile responsive design", "Contact form", "WhatsApp button", "Basic SEO setup", "Deployment support"],
  },
  {
    name: "Business",
    slug: "business",
    description: "Best for businesses that want enquiries and growth.",
    priceOneTime: 9999,
    priceMonthly: 1999,
    isPopular: true,
    features: ["5-8 pages", "Booking/enquiry form", "WhatsApp integration", "SEO setup", "Analytics setup", "1 month support"],
  },
  {
    name: "Premium",
    slug: "premium",
    description: "Best for businesses needing advanced features.",
    priceOneTime: 24999,
    priceMonthly: 3999,
    isPopular: false,
    features: ["Custom pages", "Dashboard/project tracking", "Advanced forms", "SEO structure", "Maintenance support", "Priority updates"],
  },
];

const fallbackDemoProjects: HomeDemoProject[] = [
  {
    title: "Clinic Website",
    slug: "clinic-website",
    businessType: "Clinic",
    description: "Demo Project: appointment form, WhatsApp enquiry, service pages, and Google-ready SEO structure.",
    imageUrl: null,
    demoUrl: "/portfolio/sudersan-clinic",
    features: ["Appointment form", "WhatsApp enquiry", "Local SEO"],
  },
  {
    title: "Restaurant Website",
    slug: "restaurant-website",
    businessType: "Restaurant",
    description: "Demo Project: menu browsing, reservation enquiry, offer sections, and location-first contact flow.",
    imageUrl: null,
    demoUrl: "/portfolio/urban-taste-restaurant",
    features: ["Menu sections", "Reserve CTA", "Offer blocks"],
  },
  {
    title: "Local Shop Website",
    slug: "local-shop-website",
    businessType: "Shop",
    description: "Demo Project: product highlights, WhatsApp ordering, map-ready contact, and simple enquiry capture.",
    imageUrl: null,
    demoUrl: "/portfolio/buildpro-constructions",
    features: ["Product cards", "WhatsApp order", "Map-ready contact"],
  },
];

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export async function getHomepageContent(): Promise<HomeContent> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      packages: fallbackPackages,
      demoProjects: fallbackDemoProjects,
      testimonials: [],
    };
  }

  const [packageResult, projectResult, testimonialResult] = await Promise.all([
    supabase
      .from("packages")
      .select("name, slug, description, price_one_time, price_monthly, features, is_popular")
      .eq("is_active", true)
      .order("price_one_time", { ascending: true })
      .limit(3),
    supabase
      .from("demo_projects")
      .select("title, slug, business_type, description, image_url, demo_url, features")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(3),
    supabase
      .from("testimonials")
      .select("name, business_name, message, rating")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  return {
    packages: packageResult.data?.length
      ? packageResult.data.map((item) => ({
          name: String(item.name),
          slug: String(item.slug),
          description: String(item.description || ""),
          priceOneTime: Number(item.price_one_time || 0),
          priceMonthly: Number(item.price_monthly || 0),
          features: asStringArray(item.features),
          isPopular: Boolean(item.is_popular),
        }))
      : fallbackPackages,
    demoProjects: projectResult.data?.length
      ? projectResult.data.map((item) => ({
          title: String(item.title),
          slug: String(item.slug),
          businessType: String(item.business_type || "Local Business"),
          description: String(item.description || ""),
          imageUrl: item.image_url ? String(item.image_url) : null,
          demoUrl: item.demo_url ? String(item.demo_url) : null,
          features: asStringArray(item.features),
        }))
      : fallbackDemoProjects,
    testimonials: testimonialResult.data?.length
      ? testimonialResult.data.map((item) => ({
          name: String(item.name),
          businessName: item.business_name ? String(item.business_name) : null,
          message: String(item.message),
          rating: Number(item.rating || 5),
        }))
      : [],
  };
}
