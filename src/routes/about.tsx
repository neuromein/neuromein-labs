import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { HeroCard, MetaGrid } from "@/components/HeroCard";
import { Reveal } from "@/components/Reveal";
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
      <div className="max-w-[1320px] mx-auto pb-20">
        <HeroCard
          title="Андрей Майнгардт"
          subtitle="Независимый AI-аналитик. Основатель NEUROMEIN. AI Strategist в WMT AI."
        >
          <MetaGrid
            items={[
              { label: "Кто", value: "Независимый AI-аналитик" },
              { label: "Где", value: "Россия, удалённо" },
              { label: "С какого года", value: "2022 — настоящее время" },
              { label: "Зачем", value: "Понять, как ИИ меняет работу" },
            ]}
          />
        </HeroCard>

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
                  2026–2030.
                </p>
                <p>
                  С 2022 года я веду аналитический ресурс NEUROMEIN, который
                  читают более 43 000 подписчиков. Мои исследования —
                  «Тихая замена» и «ИИ в 2025 и прогнозы на 2026» — разбирают
                  конкретные механизмы ИИ-замещения и дают проверяемые
                  прогнозы.
                </p>
                <p>
                  Сейчас я работаю AI-стратегом в компании WMT AI, где
                  консультирую бизнес по внедрению генеративного ИИ и оценке
                  рисков автоматизации.
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

        {/* Contacts */}
        <Reveal>
          <div className="mt-4 rounded-[24px] border-[0.5px] border-border bg-bg-card/40 p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
              <div>
                <div className="label-eyebrow mb-3">Связаться</div>
                <h2 className="text-[28px] lg:text-[36px] font-medium text-text-primary tracking-tight leading-[1.1]">
                  Контакты
                </h2>
              </div>
              <dl className="space-y-4 text-[15px]">
                {([
                  ["Telegram-канал", SITE.telegram, "t.me/neuromein"],
                  ["Telegram", undefined, SITE.telegramPersonal],
                  ["LinkedIn", SITE.linkedin, "Andrew Meinhardt"],
                  ["Email", `mailto:${SITE.email}`, SITE.email],
                  ["Instagram", undefined, SITE.instagram],
                ] as const).map(([label, href, value]) => (
                  <div key={label} className="flex gap-6 items-baseline">
                    <dt className="text-text-tertiary w-[140px] shrink-0 text-[13px]">
                      {label}
                    </dt>
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
            </div>
          </div>
        </Reveal>
      </div>
    </Layout>
  );
}
