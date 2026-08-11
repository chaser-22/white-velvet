import type { MetadataRoute } from "next";
import { services } from "./site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://white-velvet.se";
  const routes = ["", "/tjanster", "/fore-efter", "/priser", "/om-oss", "/faq", "/boka", "/kontakt"];
  return [...routes.map((route) => ({ url: `${base}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.7 })), ...services.map((service) => ({ url: `${base}/tjanster/${service.slug}`, changeFrequency: "monthly" as const, priority: 0.8 }))];
}
