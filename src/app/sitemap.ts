import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://claimready.example.com";

// Static informational pages only — /confirm, /diagnosis, /action, /tracker
// are stateful, query-param-driven steps in a flow (nothing to index; each
// one is meaningless without the case data carried in its URL), so they're
// deliberately excluded here the same way a checkout flow's mid-steps
// wouldn't appear in a sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, changeFrequency: "monthly" },
    { path: "/intake", priority: 0.9, changeFrequency: "monthly" },
    { path: "/transparency", priority: 0.5, changeFrequency: "monthly" },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
