import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { HeroCard } from "@/components/HeroCard";
import { HomeResearchCards } from "@/components/HomeResearchCards";
import { HomePublications } from "@/components/HomePublications";
import { SpeakingSlider } from "@/components/SpeakingSlider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Андрей Майнгардт - AI-стратег | Автор исследования «Тихая замена» | NEUROMEIN" },
      {
        name: "description",
        content:
          "AI-стратег и аналитик Андрей Майнгардт исследует трансформацию рынка труда в горизонте 2026–2030. Аналитика, исследования и проверяемые прогнозы.",
      },
      { property: "og:title", content: "Андрей Майнгардт - AI-стратег | Автор исследования «Тихая замена» | NEUROMEIN" },
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
          "@type": "WebSite",
          name: "NEUROMEIN",
          url: "https://neuromein.ru",
          author: {
            "@type": "Person",
            name: "Андрей Майнгардт",
          },
          description:
            "Аналитический ресурс об искусственном интеллекте и рынке труда. Исследования, прогнозы, аналитика.",
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
              <Link
                to="/research"
                className="inline-block group"
              >
                <h2
                  className="text-[26px] lg:text-[30px] font-medium leading-[1.15] tracking-[-0.02em] transition-opacity duration-200 group-hover:opacity-80"
                  style={{ color: "#f0f0f5" }}
                >
                  Авторские исследования
                </h2>
              </Link>
              <p
                className="mt-3 text-[15px] leading-[1.6] max-w-[560px]"
                style={{ color: "#9a9aaa" }}
              >
                О влиянии ИИ на бизнес, рынок труда и жизнь каждого из нас
              </p>
            </div>
          </div>
          <HomeResearchCards />
        </section>

        {/* SPEAKING — 100px от исследований */}
        <section style={{ paddingTop: 100 }}>
          <SpeakingSlider />
        </section>

        {/* PUBLICATIONS — 100px от слайдера, 120px до footer */}
        <section style={{ paddingTop: 100, paddingBottom: 120 }}>
          <HomePublications />
        </section>
      </div>
    </Layout>
  );
}
