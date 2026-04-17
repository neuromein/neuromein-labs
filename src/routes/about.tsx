import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { PillCta } from "@/components/ui-bits";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Андрей Майнгардт — NEUROMEIN | Независимый AI-аналитик" },
      {
        name: "description",
        content:
          "Андрей Майнгардт — независимый AI-аналитик, основатель NEUROMEIN, AI Strategist в WMT AI.",
      },
      { property: "og:title", content: "Андрей Майнгардт — NEUROMEIN" },
      {
        property: "og:description",
        content: "Независимый AI-аналитик. Основатель NEUROMEIN.",
      },
      { property: "og:url", content: "https://neuromein.ru/about" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 pb-16">
        {/* Hero name */}
        <Reveal>
          <h1 className="display-hero text-text-primary">Андрей</h1>
          <h2 className="display-hero display-hero--fade">Майнгардт</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 pt-10 border-t border-border grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[16px] text-text-secondary leading-[1.7]">
                Независимый AI-аналитик. Основатель NEUROMEIN. AI-стратег в WMT AI.
              </p>
            </div>
            <div className="space-y-5 text-[16px] text-text-secondary leading-[1.75] max-w-[560px]">
              <p>
                Я занимаюсь анализом того, как искусственный интеллект трансформирует
                рынок труда и бизнес-процессы. Моя специализация — прогнозирование
                изменений в горизонте 2026–2030.
              </p>
              <p>
                С 2022 года я веду аналитический ресурс NEUROMEIN, который читают
                более 43 000 подписчиков. Мои исследования — «Тихая замена» и «ИИ в
                2025 и прогнозы на 2026» — разбирают конкретные механизмы
                ИИ-замещения и дают проверяемые прогнозы.
              </p>
              <p>
                Сейчас я работаю AI-стратегом в компании WMT AI, где консультирую
                бизнес по внедрению генеративного ИИ и оценке рисков автоматизации.
              </p>
            </div>
          </div>
        </Reveal>

        {/* What I do */}
        <Reveal delay={0.15}>
          <div className="mt-24 border-t border-border pt-16">
            <h3 className="display-md text-text-primary mb-12">Что я делаю</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              {[
                "Пишу аналитические исследования о влиянии ИИ на рынок труда",
                "Делаю проверяемые прогнозы и публично отслеживаю их точность",
                "Консультирую бизнес по стратегии адаптации к ИИ-автоматизации",
                "Веду аналитический Telegram-канал NEUROMEIN",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-4 text-[16px] text-text-secondary leading-[1.6]"
                >
                  <span
                    className="mt-2.5 inline-block h-1.5 w-1.5 rounded-full bg-brand flex-shrink-0"
                    aria-hidden
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Contacts */}
        <Reveal delay={0.2}>
          <div className="mt-24 border-t border-border pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <h3 className="display-md text-text-primary">Контакты</h3>
              <div>
                <dl className="space-y-5 text-[15px]">
                  {([
                    ["Telegram-канал", SITE.telegram, "t.me/neuromein"],
                    ["Telegram", undefined, SITE.telegramPersonal],
                    ["LinkedIn", SITE.linkedin, "Andrew Meinhardt"],
                    ["Email", `mailto:${SITE.email}`, SITE.email],
                    ["Instagram", undefined, SITE.instagram],
                  ] as const).map(([label, href, value]) => (
                    <div key={label} className="flex gap-6">
                      <dt className="text-text-tertiary w-[160px] shrink-0">{label}</dt>
                      <dd>
                        {href ? (
                          <a
                            href={href}
                            target={href.startsWith("http") ? "_blank" : undefined}
                            rel="noreferrer"
                            className="text-text-primary hover:text-brand transition-colors"
                          >
                            {value}
                          </a>
                        ) : (
                          <span className="text-text-primary">{value}</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-10">
                  <PillCta href={SITE.telegram} external>
                    Telegram-канал
                  </PillCta>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </Layout>
  );
}
