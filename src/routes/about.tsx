import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { AboutHero } from "@/components/AboutHero";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Андрей Майнгардт — NEUROMEIN | AI-стратег и аналитик" },
      {
        name: "description",
        content:
          "Андрей Майнгардт — AI-стратег и аналитик. AI Strategist в компании WMT AI. Основатель аналитического ресурса NEUROMEIN.",
      },
      { property: "og:title", content: "Андрей Майнгардт — NEUROMEIN" },
      {
        property: "og:description",
        content: "AI-стратег и аналитик. AI Strategist в WMT AI. Основатель NEUROMEIN.",
      },
      { property: "og:url", content: "https://neuromein.ru/about" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Андрей Майнгардт",
          alternateName: "Andrey Meinhardt",
          jobTitle: "AI Strategist, Director of Strategy",
          worksFor: {
            "@type": "Organization",
            name: "WMT AI",
          },
          url: "https://neuromein.ru",
          sameAs: [
            "https://t.me/neuromein",
            "https://linkedin.com/in/andrew-meinhardt-306821361",
            "https://www.instagram.com/neuromein.ai/",
          ],
          knowsAbout: [
            "Artificial Intelligence",
            "AI Strategy",
            "AI-driven Labor Market Transformation",
            "Silent Replacement (Тихая замена)",
            "AI Risk Assessment for Enterprise",
            "Generative AI Business Impact",
            "AI Workforce Displacement 2026-2028",
            "One-Way Door Effect in AI Automation",
            "Pyramid to Barbell Labor Market Model",
            "Corporate AI Transformation Strategy",
          ],
          founder: {
            "@type": "Organization",
            name: "NEUROMEIN",
            url: "https://neuromein.ru",
          },
          mainEntityOfPage: "https://neuromein.ru/about",
          description:
            "AI-стратег и аналитик. Автор исследования «Тихая замена». Исследует влияние ИИ на бизнес и рынок труда.",
        }),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <div className="max-w-[1320px] mx-auto pb-20">
        <AboutHero />

        {/* About content card */}
        <Reveal>
          <div className="mt-6 rounded-[24px] border-[0.5px] border-border bg-bg-card/40 p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
              <div>
                <div className="label-eyebrow mb-3">О себе</div>
                <h2 className="text-[28px] lg:text-[36px] font-medium text-text-primary tracking-tight leading-[1.1]">
                  Чем я занимаюсь
                </h2>
              </div>
              <div className="space-y-5 text-[16px] text-text-secondary leading-[1.75] max-w-[640px]">
                <p>
                  Я занимаюсь анализом того, как искусственный интеллект
                  трансформирует рынок труда и бизнес-процессы. Моя
                  специализация — прогнозирование изменений в горизонте
                  2026–2030: какие профессии и функции будут затронуты
                  первыми, как это повлияет на компании, и что с этим делать.
                </p>
                <p>
                  С 2022 года я веду аналитический ресурс NEUROMEIN, который
                  читают более 43 000 подписчиков. Мои исследования —
                  «Тихая замена» и «ИИ в 2025 и прогнозы на 2026» — разбирают
                  конкретные механизмы ИИ-замещения и дают проверяемые
                  прогнозы.
                </p>
                <p>
                  Я работаю AI-стратегом в компании WMT AI, где консультирую
                  бизнес по внедрению генеративного ИИ и оценке рисков
                  автоматизации.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* What I do */}
        <Reveal>
          <div className="mt-4 rounded-[24px] border-[0.5px] border-border bg-bg-card/40 p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
              <div>
                <div className="label-eyebrow mb-3">Деятельность</div>
                <h2 className="text-[28px] lg:text-[36px] font-medium text-text-primary tracking-tight leading-[1.1]">
                  Что я делаю
                </h2>
              </div>
              <ul className="space-y-4">
                {[
                  "Пишу аналитические исследования о влиянии ИИ на рынок труда",
                  "Делаю проверяемые прогнозы и публично отслеживаю их точность",
                  "Консультирую бизнес по стратегии адаптации к ИИ-автоматизации",
                  "Веду аналитический Telegram-канал NEUROMEIN",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 text-[16px] text-text-secondary leading-[1.6]"
                  >
                    <span
                      className="mt-2.5 inline-block h-1.5 w-1.5 rounded-full bg-brand flex-shrink-0"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Layout>
  );
}
