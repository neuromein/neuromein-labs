import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/ui-bits";
import { Reveal } from "@/components/Reveal";
import { RESEARCH } from "@/lib/site";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Исследования — NEUROMEIN | Андрей Майнгардт" },
      {
        name: "description",
        content:
          "Крупные аналитические работы Андрея Майнгардта о влиянии ИИ на рынок труда: «Тихая замена» и «ИИ в 2025 и прогнозы на 2026».",
      },
      { property: "og:title", content: "Исследования — NEUROMEIN" },
      {
        property: "og:description",
        content:
          "Аналитические исследования о влиянии ИИ на рынок труда и экономику.",
      },
      { property: "og:url", content: "https://neuromein.ru/research" },
    ],
  }),
  component: ResearchListPage,
});

function ResearchListPage() {
  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-6 lg:px-8 pt-20 pb-12">
        <Reveal>
          <PageHeader
            eyebrow="Раздел"
            title="Исследования"
            description="Крупные аналитические работы о влиянии ИИ на рынок труда и экономику."
          />
        </Reveal>

        <div className="mt-16 space-y-5">
          {RESEARCH.map((r, i) => (
            <Reveal key={r.slug} delay={i * 0.1}>
              <Link to="/research/$slug" params={{ slug: r.slug }} className="block group">
                <motion.article
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[12px] border-[0.5px] border-border bg-bg-card p-8 lg:p-10 transition-colors duration-300 group-hover:border-border-strong"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: r.dotColor }}
                      aria-hidden
                    />
                    <span className="label-eyebrow">{r.eyebrow} · {r.year}</span>
                  </div>
                  <h2 className="mt-5 text-[28px] font-medium text-text-primary tracking-tight">
                    {r.title}
                  </h2>
                  <p className="mt-4 text-[15px] text-text-secondary leading-[1.7] max-w-[640px]">
                    {r.long}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-[13px] text-brand group-hover:text-brand-hover transition-colors">
                    <span>Читать полностью</span>
                    <span aria-hidden>→</span>
                  </div>
                </motion.article>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </Layout>
  );
}
