import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Андрей Майнгардт — NEUROMEIN | Независимый AI-аналитик" },
      {
        name: "description",
        content:
          "Андрей Майнгардт — независимый AI-аналитик, основатель NEUROMEIN, AI Strategist в WMT AI. Анализ влияния ИИ на рынок труда и проверяемые прогнозы.",
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
      <section className="max-w-3xl mx-auto px-6 lg:px-8 pt-20 pb-12">
        <Reveal>
          <div className="flex items-center gap-5">
            <div
              className="h-20 w-20 rounded-full flex items-center justify-center text-[24px] font-medium text-text-primary"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in oklch, var(--color-brand) 30%, var(--color-bg-card)), var(--color-bg-card))",
                border: "0.5px solid var(--color-border-strong)",
              }}
              aria-hidden
            >
              АМ
            </div>
            <div>
              <h1 className="text-[34px] sm:text-[38px] font-medium text-text-primary tracking-tight">
                Андрей Майнгардт
              </h1>
              <p className="mt-1 text-[15px] text-text-secondary">
                Независимый AI-аналитик. Основатель NEUROMEIN.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 space-y-5 text-[16px] text-text-secondary leading-[1.75] max-w-[640px]">
            <p>
              Я занимаюсь анализом того, как искусственный интеллект трансформирует
              рынок труда и бизнес-процессы. Моя специализация — прогнозирование
              изменений в горизонте 2026–2030: какие профессии и функции будут
              затронуты первыми, как это повлияет на компании, и что с этим
              делать.
            </p>
            <p>
              С 2022 года я веду аналитический ресурс NEUROMEIN.AI, который читают
              более 43 000 подписчиков. Мои исследования — «Тихая замена» и «ИИ в
              2025 и прогнозы на 2026» — разбирают конкретные механизмы
              ИИ-замещения и дают проверяемые прогнозы.
            </p>
            <p>
              Сейчас я работаю AI-стратегом в компании WMT AI, где консультирую
              бизнес по внедрению генеративного ИИ и оценке рисков автоматизации.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-16">
            <h2 className="text-[20px] font-medium text-text-primary">Что я делаю</h2>
            <ul className="mt-5 space-y-3">
              {[
                "Пишу аналитические исследования о влиянии ИИ на рынок труда",
                "Делаю проверяемые прогнозы и публично отслеживаю их точность",
                "Консультирую бизнес по стратегии адаптации к ИИ-автоматизации",
                "Веду аналитический Telegram-канал NEUROMEIN",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-[15px] text-text-secondary leading-[1.6]"
                >
                  <span
                    className="mt-2.5 inline-block h-1 w-1 rounded-full bg-brand flex-shrink-0"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-16 rounded-[12px] bg-bg-card border-[0.5px] border-border p-7 lg:p-8">
            <h2 className="text-[20px] font-medium text-text-primary">Контакты</h2>
            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-y-4 gap-x-6 text-[14px]">
              <dt className="text-text-tertiary">Telegram-канал</dt>
              <dd>
                <a
                  href={SITE.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-primary hover:text-brand transition-colors"
                >
                  t.me/neuromein
                </a>
              </dd>

              <dt className="text-text-tertiary">Telegram</dt>
              <dd className="text-text-primary">{SITE.telegramPersonal}</dd>

              <dt className="text-text-tertiary">LinkedIn</dt>
              <dd>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-primary hover:text-brand transition-colors"
                >
                  linkedin.com/in/andrew-meinhardt-306821361
                </a>
              </dd>

              <dt className="text-text-tertiary">Email</dt>
              <dd>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-text-primary hover:text-brand transition-colors"
                >
                  {SITE.email}
                </a>
              </dd>

              <dt className="text-text-tertiary">Instagram</dt>
              <dd className="text-text-primary">{SITE.instagram}</dd>
            </dl>
          </div>
        </Reveal>
      </section>
    </Layout>
  );
}
