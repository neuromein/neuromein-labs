import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { HeroCard } from "@/components/HeroCard";
import { HomeResearchCards } from "@/components/HomeResearchCards";
import { HomePublications } from "@/components/HomePublications";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEUROMEIN — Андрей Майнгардт. AI-стратег и аналитик" },
      {
        name: "description",
        content:
          "AI-стратег и аналитик Андрей Майнгардт исследует трансформацию рынка труда в горизонте 2026–2030. Аналитика, исследования и проверяемые прогнозы.",
      },
      { property: "og:title", content: "NEUROMEIN — Андрей Майнгардт. AI-стратег и аналитик" },
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
          jobTitle: "AI-стратег и аналитик",
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
      <div className="max-w-[1320px] mx-auto">
        {/* HERO */}
        <HeroCard />

        {/* RESEARCH — две карточки в ряд, 80px от hero */}
        <section style={{ paddingTop: 80 }}>
          <HomeResearchCards />
        </section>

        {/* PUBLICATIONS — 100px от карточек, 120px до footer */}
        <section style={{ paddingTop: 100, paddingBottom: 120 }}>
          <HomePublications />
        </section>
      </div>
    </Layout>
  );
}
