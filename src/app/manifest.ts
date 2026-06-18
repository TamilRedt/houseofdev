import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "House Of Dev",
    short_name: "House Of Dev",
    description:
      "Websites, dashboards, booking systems, business automation, and AI-powered workflows for local businesses.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F0E6",
    theme_color: "#172A46",
    icons: [
      {
        src: "/brand/houseofdev-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
