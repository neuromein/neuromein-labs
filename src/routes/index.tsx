import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { HeroCard } from "@/components/HeroCard";
import { Reveal } from "@/components/Reveal";
import { BentoGrid } from "@/components/BentoGrid";
import { Marquee } from "@/components/Marquee";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEUROMEIN — Андрей Майнгардт. Независимый AI-аналитик" },
      {
        name: "description",
        content:
          "Независимый AI-аналитик Андрей Майнгардт исследует трансформацию рынка труда в горизонте 2026–2030. Аналитика, исследования и проверяемые прогнозы.",
      },
      { property: "og:title", content: "NEUROMEIN — Андрей Майнгардт. Независимый AI-аналитик" },
      {
        property: "og:description",
        content:
          "Исследования и проверяемые прогнозы о влиянии ИИ на рынок труда, профессии и экономику.",
      },
      { property: "og:url", content: "https://neuromein.ru/" },
      { rel: "canonical", href: "https://neuromein.ru/" } as never,
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Андрей Майнгардт",
          alternateName: "Andrew Meinhardt",
          jobTitle: "Независимый AI-аналитик",
          url: "https://neuromein.ru",
          sameAs: [
            "https://t.me/neuromein",
            "https://linkedin.com/in/andrew-meinhardt-306821361",
          ],
        }),
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  return (
    <Layout>
      <div className="max-w-[1320px] mx-auto pb-20">
        {/* HERO CARD */}
        <HeroCard />

        {/* BENTO GRID — research / predictions / about / publications */}
        <section className="pt-12">
          <Reveal>
            <BentoGrid />
          </Reveal>
        </section>

        {/* MARQUEE — visual divider */}
        <Marquee />
      </div>
    </Layout>
  );
}
