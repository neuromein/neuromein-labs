import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { AboutHero } from "@/components/AboutHero";
import { Reveal } from "@/components/Reveal";


export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Андрей Майнгардт – об авторе и проекте NEUROMEIN" },
      {
        name: "description",
        content:
          "Андрей Майнгардт – эксперт по влиянию ИИ на бизнес-процессы и рынок труда, автор исследования «Тихая замена». Основатель аналитического ресурса NEUROMEIN.",
      },
      { property: "og:title", content: "Андрей Майнгардт – NEUROMEIN" },
      {
        property: "og:description",
        content: "Эксперт по влиянию ИИ на бизнес-процессы и рынок труда. Автор «Тихой замены». Основатель NEUROMEIN.",
      },
      { property: "og:url", content: "https://neuromein.ru/about" },
    ],
    links: [
      { rel: "canonical", href: "https://neuromein.ru/about" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          name: "Андрей Майнгардт – эксперт по влиянию ИИ на рынок труда",
          url: "https://neuromein.ru/about",
          mainEntity: { "@id": "https://neuromein.ru/#person" },
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
                  ИИ меняет рынок труда не громкими увольнениями, а тихо –
                  перераспределяя задачи внутри существующих должностей.
                  Большинство замечает это слишком поздно. Я разбираю процесс по
                  шагам: где он уже идёт, кого затронет следующим и что с этим
                  делать – бизнесу и людям.
                </p>
                <p>
                  Я не торгую тревогой и не обещаю, что «всё обойдётся». Делаю
                  прогнозы с конкретными датами и публично отслеживаю, сбылись
                  они или нет. Точность открыта – её можно проверить в разделе
                  «Прогнозы».
                </p>
                <p>
                  В WMT AI я консультирую крупный бизнес по адаптации к
                  ИИ-автоматизации. Это даёт взгляд на трансформацию изнутри
                  компаний, а не только по отчётам.
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
