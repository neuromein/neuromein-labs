import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { NeuralNetwork } from "@/components/NeuralNetwork";
import { PillCta, GhostPill, Pill, ArrowLink } from "@/components/ui-bits";
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
      {/* HERO — giant typography */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-8 lg:pt-16">
        <FadeIn>
          <div className="label-eyebrow">Независимый AI-аналитик</div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="mt-8 display-hero text-text-primary tracking-tight">
            Как ИИ
          </h1>
        </FadeIn>
        <FadeIn delay={0.15}>
          <h2 className="display-hero display-hero--fade">
            перестраивает работу
          </h2>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="mt-14 flex flex-col sm:flex-row items-start justify-between gap-10 border-t border-border pt-10">
            <p className="text-[16px] text-text-secondary leading-[1.65] max-w-[460px]">
              Исследую трансформацию рынка труда в горизонте 2026–2030.
              Пишу аналитику, делаю проверяемые прогнозы, разбираю
              последствия для бизнеса и специалистов.
            </p>
            <div className="flex flex-wrap gap-3">
              <PillCta to="/research">Читать исследования</PillCta>
              <GhostPill href={SITE.telegram} external>
                Telegram-канал
              </GhostPill>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* NEURAL NETWORK — decorative section */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-24">
        <Reveal>
          <div className="max-w-[600px] mx-auto opacity-50">
            <NeuralNetwork />
          </div>
        </Reveal>
      </section>

      {/* RESEARCH CARDS */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 pb-16">
        <div className="border-t border-border pt-16">
          <Reveal>
            <div className="label-eyebrow mb-10">Исследования</div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RESEARCH.map((r, i) => (
              <Reveal key={r.slug} delay={i * 0.1}>
                <Link
                  to="/research/$slug"
                  params={{ slug: r.slug }}
                  className="block group"
                >
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-2xl border-[0.5px] border-border p-7 lg:p-8 h-full transition-colors duration-300 group-hover:border-border-strong"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background: r.dotColor }}
                        aria-hidden
                      />
                      <span className="label-eyebrow">{r.eyebrow} · {r.year}</span>
                    </div>
                    <h3 className="mt-5 text-[22px] font-medium text-text-primary tracking-tight">
                      {r.title}
                    </h3>
                    <p className="mt-3 text-[14px] text-text-secondary leading-[1.65]">
                      {r.short}
                    </p>
                    <div className="mt-6">
                      <ArrowLink>Читать</ArrowLink>
                    </div>
                  </motion.div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PUBLICATIONS */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-24 border-t border-border">
        <div className="flex items-end justify-between gap-6 mb-10">
          <Reveal>
            <h2 className="display-md text-text-primary">Публикации</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <Link
              to="/blog"
              className="hidden sm:inline-flex text-[14px] text-text-secondary hover:text-text-primary transition-colors"
            >
              Все →
            </Link>
          </Reveal>
        </div>

        <div className="border-t border-border">
          {PUBLICATIONS.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-6 border-b border-border group"
              >
                <span className="text-[13px] text-text-tertiary tabular-nums shrink-0 w-[140px]">
                  {p.dateLabel}
                </span>
                <span className="text-[16px] text-text-primary flex-1 group-hover:text-brand transition-colors">
                  {p.title}
                </span>
                <Pill className="self-start sm:self-auto">{p.tag}</Pill>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ABOUT BLOCK */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-24 border-t border-border">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="display-md text-text-primary">О проекте</h2>
            </div>
            <div className="max-w-[560px]">
              <p className="text-[18px] text-text-secondary leading-[1.6]">
                NEUROMEIN — независимый аналитический ресурс об искусственном интеллекте
                и его влиянии на рынок труда. Основан Андреем Майнгардтом в 2022 году.
              </p>
              <p className="mt-4 text-[16px] text-text-tertiary leading-[1.65]">
                Аудитория проекта — более 43 000 подписчиков.
              </p>
              <div className="mt-8">
                <PillCta to="/about" variant="dark">Подробнее</PillCta>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </Layout>
  );
}
