import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { NeuralNetwork } from "@/components/NeuralNetwork";
import { ButtonLink, Pill } from "@/components/ui-bits";
import { FadeIn, Reveal } from "@/components/Reveal";
import { PUBLICATIONS, RESEARCH, SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "NEUROMEIN — Андрей Майнгардт. Независимый AI-аналитик",
      },
      {
        name: "description",
        content:
          "Независимый AI-аналитик Андрей Майнгардт исследует трансформацию рынка труда в горизонте 2026–2030. Аналитика, исследования и проверяемые прогнозы.",
      },
      { property: "og:title", content: "NEUROMEIN — Андрей Майнгардт. Независимый AI-аналитик" },
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
          jobTitle: "Независимый AI-аналитик",
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
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7">
              <FadeIn>
                <div className="label-eyebrow">Независимый AI-аналитик</div>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="mt-5 text-[36px] sm:text-[42px] lg:text-[44px] font-medium text-text-primary leading-[1.15] tracking-tight max-w-[540px] text-balance">
                  Как ИИ перестраивает работу, профессии и экономику
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="mt-6 text-[15px] text-text-secondary leading-[1.65] max-w-[460px]">
                  Исследую трансформацию рынка труда в горизонте 2026–2030. Пишу
                  аналитику, делаю проверяемые прогнозы, разбираю последствия для
                  бизнеса и специалистов.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <ButtonLink to="/research">Читать исследования</ButtonLink>
                  <ButtonLink href={SITE.telegram} external variant="secondary">
                    Telegram-канал
                  </ButtonLink>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-5">
              <FadeIn delay={0.4} duration={1.5}>
                <NeuralNetwork />
              </FadeIn>
            </div>
          </div>

          {/* Research cards */}
          <div className="mt-20 pt-12 border-t border-[#14141c]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RESEARCH.map((r, i) => (
                <Reveal key={r.slug} delay={0.3 + i * 0.1}>
                  <Link
                    to="/research/$slug"
                    params={{ slug: r.slug }}
                    className="block group"
                  >
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-[10px] border-[0.5px] border-border p-6 h-full transition-colors duration-300 group-hover:border-border-strong"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full"
                          style={{ background: r.dotColor }}
                          aria-hidden
                        />
                        <span className="label-eyebrow">{r.eyebrow}</span>
                      </div>
                      <h3 className="mt-4 text-[15px] font-medium text-[#dddde5]">
                        {r.title}
                      </h3>
                      <p className="mt-2 text-[12px] text-[#55556a] leading-[1.6]">
                        {r.short}
                      </p>
                    </motion.div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PUBLICATIONS */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-24 pb-8">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-[24px] font-medium text-text-primary">Последние публикации</h2>
            <Link
              to="/blog"
              className="hidden sm:inline-flex text-[13px] text-brand hover:text-brand-hover transition-colors"
            >
              Все публикации →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 border-t border-border">
          {PUBLICATIONS.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="grid grid-cols-12 gap-4 items-center py-5 border-b border-border group"
              >
                <span className="col-span-12 sm:col-span-3 text-[13px] text-text-tertiary tabular-nums">
                  {p.dateLabel}
                </span>
                <span className="col-span-12 sm:col-span-7 text-[15px] text-[#dddde5] group-hover:text-text-primary transition-colors">
                  {p.title}
                </span>
                <span className="col-span-12 sm:col-span-2 sm:text-right">
                  <Pill>{p.tag}</Pill>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-6 sm:hidden">
            <Link to="/blog" className="text-[14px] text-brand">
              Все публикации →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ABOUT */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 pt-24">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <div className="label-eyebrow">О проекте</div>
            </div>
            <div className="md:col-span-9 max-w-[640px]">
              <p className="text-[18px] text-text-primary leading-[1.55] font-normal">
                NEUROMEIN — независимый аналитический ресурс об искусственном интеллекте
                и его влиянии на рынок труда.
              </p>
              <p className="mt-5 text-[15px] text-text-secondary leading-[1.7]">
                Основан Андреем Майнгардтом в 2022 году. Аудитория проекта — более
                43 000 подписчиков.
              </p>
              <Link
                to="/about"
                className="mt-8 inline-flex text-[14px] text-brand hover:text-brand-hover transition-colors"
              >
                Подробнее →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </Layout>
  );
}
