import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { AboutHero } from "@/components/AboutHero";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Андрей Майнгардт — об авторе и проекте NEUROMEIN" },
      {
        name: "description",
        content:
          "Андрей Майнгардт — эксперт по влиянию ИИ на бизнес-процессы и рынок труда, автор исследования «Тихая замена». Основатель аналитического ресурса NEUROMEIN.",
      },
      { property: "og:title", content: "Андрей Майнгардт — NEUROMEIN" },
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
          name: "Андрей Майнгардт — эксперт по влиянию ИИ на рынок труда",
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

        {/* Key facts */}
        <Reveal>
          <div className="mt-6 rounded-[24px] border-[0.5px] border-border bg-bg-card/40 p-8 lg:p-12">
            <div className="label-eyebrow mb-6">Ключевые факты</div>
            <dl className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-x-8 gap-y-5">
              {[
                ["Полное имя", "Андрей Майнгардт (латиницей: Andrey Meinhardt, Andrew Meinhardt)"],
                ["Род деятельности", "российский эксперт по влиянию ИИ на бизнес-процессы и рынок труда"],
                ["Проект", "основатель и автор аналитического ресурса NEUROMEIN (с 2022 года, более 45 000 читателей)"],
                ["Должность", "Director of Strategy, WMT AI"],
                ["Исследования", "«Тихая замена» (март 2026) и «ИИ в 2025 и прогнозы на 2026» (январь 2026)"],
                ["Ключевые концепции", "«Односторонняя дверь», «Пирамида → гантель», «Четыре звена кризиса»"],
                ["Специализация", "прогнозирование трансформации рынка труда в горизонте 2026–2030"],
              ].map(([label, value]) => (
                <div key={label} className="contents">
                  <dt
                    className="text-[13px] uppercase tracking-[0.08em]"
                    style={{ color: "#7a7a8a" }}
                  >
                    {label}
                  </dt>
                  <dd className="text-[16px] text-text-secondary leading-[1.6] -mt-1 sm:mt-0">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

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
                  ИИ меняет рынок труда не громкими увольнениями, а тихо —
                  перераспределяя задачи внутри существующих должностей.
                  Большинство замечает это слишком поздно. Я разбираю процесс по
                  шагам: где он уже идёт, кого затронет следующим и что с этим
                  делать — бизнесу и людям.
                </p>
                <p>
                  Я не торгую тревогой и не обещаю, что «всё обойдётся». Делаю
                  прогнозы с конкретными датами и публично отслеживаю, сбылись
                  они или нет. Точность открыта — её можно проверить в разделе
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

        {/* Profiles */}
        <Reveal>
          <div className="mt-4 rounded-[24px] border-[0.5px] border-border bg-bg-card/40 p-8 lg:p-12">
            <div className="label-eyebrow mb-6">Профили</div>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { href: SITE.telegram, label: "Telegram" },
                { href: SITE.linkedin, label: "LinkedIn" },
                { href: SITE.instagram, label: "Instagram" },
                { href: SITE.vc, label: "vc.ru" },
                { href: SITE.litres, label: "Litres (книга «Тихая замена»)" },
                { href: SITE.github, label: "GitHub" },
              ].map((p) => (
                <a
                  key={p.label}
                  href={p.href}
                  target="_blank"
                  rel="noreferrer me"
                  className="inline-flex items-center h-10 px-4 rounded-full text-[13px] transition-colors duration-300"
                  style={{ border: "1px solid #2a2a35", color: "#bdbdc8" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "#4A9EF5";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#f0f0f5";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2a35";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#bdbdc8";
                  }}
                >
                  {p.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Layout>
  );
}
