import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/business-info";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { url: "", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/gallery", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/lumber", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/building-materials", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/ace-hardware", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/benjamin-moore-paint", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/decking-railing", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/grills-outdoor-living", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/doors-windows", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/tools-hardware", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/contractor-services", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/delivery", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/outlet-closeouts", priority: 0.7, changeFrequency: "weekly" as const },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.url}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
