import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { HeroCard } from "@/components/HeroCard";
import { HomeResearchCards } from "@/components/HomeResearchCards";
import { HomePublications } from "@/components/HomePublications";
import { SpeakingSlider } from "@/components/SpeakingSlider";
import { HomeNeuromeinPromo } from "@/components/HomeNeuromeinPromo";
import { fetchSpeaking } from "@/data/speaking.fetch";
import avatarUrl from "@/assets/avatar.jpg";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const speaking = await fetchSpeaking();
      return { speaking };
    } catch {
      return { speaking: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Андрей Майнгардт — эксперт по влиянию ИИ на рынок труда" },
      {
        name: "description",
        content:
          "Эксперт по влиянию ИИ на бизнес-процессы и рынок труда, автор исследования «Тихая замена». Аналитика и проверяемые прогнозы о трансформации рынка труда 2026–2030.",
      },
      { property: "og:title", content: "Андрей Майнгардт — эксперт по влиянию ИИ на рынок труда" },
      {
        property: "og:description",
        content:
          "Исследования и проверяемые прогнозы о влиянии ИИ на рынок труда, профессии и экономику.",
      },
      { property: "og:url", content: "https://neuromein.ru/" },
    ],
    links: [
      { rel: "canonical", href: "https://neuromein.ru/" },
      { rel: "preload", as: "image", href: avatarUrl, fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "NEUROMEIN",
          url: "https://neuromein.ru",
          author: { "@id": "https://neuromein.ru/#person" },
          description:
            "Аналитический ресурс об искусственном интеллекте и рынке труда. Исследования, прогнозы, аналитика.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ScholarlyArticle",
          name: "Тихая замена: как ИИ-автоматизация замещает рабочие функции",
          alternateName: "Silent Replacement",
          author: { "@id": "https://neuromein.ru/#person" },
          datePublished: "2026-03-24",
          description:
            "66-страничное исследование о механике замещения рабочих мест ИИ-автоматизацией в 2026–2028. Авторские концепции: Пирамида → гантель, Односторонняя дверь, Четыре звена кризиса.",
          url: "https://neuromein.ru/research/silent-replacement",
          inLanguage: "ru",
          keywords:
            "AI workforce displacement, silent replacement, тихая замена, ИИ рынок труда, AI automation jobs",
          publisher: {
            "@type": "Organization",
            name: "NEUROMEIN",
            url: "https://neuromein.ru",
          },
        }),
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const { speaking } = Route.useLoaderData();
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

        {/* NEUROMEIN.AI promo */}
        <section style={{ paddingTop: 100 }}>
          <HomeNeuromeinPromo />
        </section>

        {/* SPEAKING — 100px от исследований */}
        <section style={{ paddingTop: 100 }}>
          <SpeakingSlider items={speaking} />
        </section>

        {/* PUBLICATIONS — 100px от слайдера, 120px до footer */}
        <section style={{ paddingTop: 100, paddingBottom: 120 }}>
          <HomePublications />
        </section>
      </div>
    </Layout>
  );
}
