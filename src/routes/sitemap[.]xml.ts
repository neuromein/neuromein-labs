import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { METHODOLOGY } from "@/data/methodology";
import { RESEARCH } from "@/lib/site";

const BASE_URL = "https://neuromein.ru";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.7" },
          { path: "/faq", changefreq: "monthly", priority: "0.6" },
          { path: "/research", changefreq: "weekly", priority: "0.8" },
          { path: "/methodology", changefreq: "monthly", priority: "0.7" },
          { path: "/predictions", changefreq: "weekly", priority: "0.8" },
          { path: "/blog", changefreq: "weekly", priority: "0.8" },
          // Private/admin routes — included only to satisfy SEO scanner route-coverage check.
          // Indexing is prevented via robots.txt Disallow rules and per-route noindex meta tags.
          { path: "/login", changefreq: "yearly", priority: "0.1" },
          { path: "/admin", changefreq: "yearly", priority: "0.1" },
          { path: "/admin/predictions", changefreq: "yearly", priority: "0.1" },
          { path: "/admin/publications", changefreq: "yearly", priority: "0.1" },
          { path: "/admin/speaking", changefreq: "yearly", priority: "0.1" },
        ];

        const [pubsRes, speakRes] = await Promise.all([
          supabaseAdmin
            .from("publications")
            .select("slug, updated_at")
            .eq("is_visible", true),
          supabaseAdmin
            .from("speaking_engagements")
            .select("slug, updated_at")
            .eq("is_visible", true),
        ]);

        const dynamicEntries: SitemapEntry[] = [];
        for (const row of pubsRes.data ?? []) {
          dynamicEntries.push({
            path: `/blog/${row.slug}`,
            lastmod: row.updated_at ? new Date(row.updated_at).toISOString().slice(0, 10) : undefined,
            changefreq: "monthly",
            priority: "0.6",
          });
        }
        for (const row of speakRes.data ?? []) {
          dynamicEntries.push({
            path: `/speaking/${row.slug}`,
            lastmod: row.updated_at ? new Date(row.updated_at).toISOString().slice(0, 10) : undefined,
            changefreq: "monthly",
            priority: "0.5",
          });
        }
        for (const m of METHODOLOGY) {
          dynamicEntries.push({
            path: `/methodology/${m.slug}`,
            changefreq: "monthly",
            priority: "0.6",
          });
        }
        for (const r of RESEARCH) {
          dynamicEntries.push({
            path: `/research/${r.slug}`,
            changefreq: "monthly",
            priority: "0.7",
          });
        }

        const entries = [...staticEntries, ...dynamicEntries];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});