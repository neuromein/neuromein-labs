import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/HeroCard";
import { ArrowLink } from "@/components/ui-bits";
import { Reveal } from "@/components/Reveal";
import { RESEARCH } from "@/lib/site";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Исследования — NEUROMEIN | Андрей Майнгардт" },
      {
        name: "description",
        content:
          "Крупные аналитические работы Андрея Майнгардта о влиянии ИИ на рынок труда.",
      },
      { property: "og:title", content: "Исследования — NEUROMEIN" },
      {
        property: "og:description",
        content: "Аналитические исследования о влиянии ИИ на рынок труда и экономику.",
      },
      { property: "og:url", content: "https://neuromein.ru/research" },
    ],
  }),
  component: ResearchListPage,
});

function ResearchListPage() {
  return (
    <Layout>
      <div className="max-w-[1320px] mx-auto pb-20">
        <PageHero
          eyebrow="Аналитика"
          title="Исследования"
          description="Крупные аналитические работы о влиянии ИИ на рынок труда и экономику. Каждое — с проверяемыми прогнозами и открытой методологией."
        />

        <div className="mt-6 space-y-4">
          {RESEARCH.map((r, i) => (
            <Reveal key={r.slug} delay={i * 0.08}>
              <Link to="/research/$slug" params={{ slug: r.slug }} className="block group">
                <motion.article
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[24px] border-[0.5px] border-border bg-bg-card/40 p-8 lg:p-12 transition-colors duration-300 group-hover:border-border-strong group-hover:bg-bg-card/60"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: r.dotColor }}
                      aria-hidden
                    />
                    <span className="label-eyebrow">{r.eyebrow} · {r.year}</span>
                  </div>
                  <h2 className="mt-6 text-[32px] lg:text-[44px] font-medium text-text-primary tracking-[-0.02em] leading-[1.05]">
                    {r.title}
                  </h2>
                  <p className="mt-5 text-[16px] text-text-secondary leading-[1.7] max-w-[680px]">
                    {r.long}
                  </p>
                  <div className="mt-8">
                    <ArrowLink>Читать полностью</ArrowLink>
                  </div>
                </motion.article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Layout>
  );
}
