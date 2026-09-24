import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://white-velvet.se", changeFrequency: "weekly", priority: 1 },
    { url: "https://white-velvet.se/integritet", changeFrequency: "yearly", priority: 0.2 },
    { url: "https://white-velvet.se/cookies", changeFrequency: "yearly", priority: 0.2 },
  ];
}
