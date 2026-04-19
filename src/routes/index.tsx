import { createFileRoute, Link } from "@tanstack/react-router";
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
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div
                className="text-[11px] uppercase"
                style={{ color: "#5a5a6a", letterSpacing: "0.06em" }}
              >
                Исследования
              </div>
              <h2
                className="mt-2 text-[26px] lg:text-[30px] font-medium leading-[1.15] tracking-[-0.02em]"
                style={{ color: "#f0f0f5" }}
              >
                Авторские исследования
              </h2>
              <p
                className="mt-3 text-[15px] leading-[1.6] max-w-[560px]"
                style={{ color: "#9a9aaa" }}
              >
                О влиянии ИИ на бизнес, рынок труда и жизнь каждого из нас.
              </p>
            </div>
          </div>
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
