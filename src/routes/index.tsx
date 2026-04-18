import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { HeroCard } from "@/components/HeroCard";
import { ArrowLink, Pill } from "@/components/ui-bits";
import { Reveal } from "@/components/Reveal";
import { PUBLICATIONS, RESEARCH, SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEUROMEIN — Андрей Майнгардт. Независимый AI-аналитик" },
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
      <div className="max-w-[1320px] mx-auto pb-20">
        {/* HERO CARD */}
        <HeroCard
          title="Изучаю, как ИИ перестраивает работу и рынок труда."
          subtitle="Независимый AI-аналитик · Основатель NEUROMEIN · AI Strategist в WMT AI"
        />

        {/* RESEARCH */}
        <Reveal>
          <SectionHeader
            eyebrow="Аналитика"
            title="Исследования"
            link={{ to: "/research", label: "Все исследования" }}
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {RESEARCH.map((r, i) => (
            <Reveal key={r.slug} delay={i * 0.08}>
              <Link
                to="/research/$slug"
                params={{ slug: r.slug }}
                className="block group h-full"
              >
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[24px] border-[0.5px] border-border bg-bg-card/60 p-7 lg:p-8 h-full transition-colors duration-300 group-hover:border-border-strong"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: r.dotColor }}
                      aria-hidden
                    />
                    <span className="label-eyebrow">{r.eyebrow} · {r.year}</span>
                  </div>
                  <h3 className="mt-5 text-[24px] font-medium text-text-primary tracking-tight leading-[1.15]">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-[14px] text-text-secondary leading-[1.65]">
                    {r.short}
                  </p>
                  <div className="mt-7">
                    <ArrowLink>Читать</ArrowLink>
                  </div>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* PUBLICATIONS */}
        <Reveal>
          <SectionHeader
            eyebrow="Заметки"
            title="Публикации"
            link={{ to: "/blog", label: "Все публикации" }}
          />
        </Reveal>

        <div className="rounded-[24px] border-[0.5px] border-border bg-bg-card/40 mt-6 overflow-hidden">
          {PUBLICATIONS.slice(0, 4).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-6 lg:px-8 py-5 border-b border-border last:border-b-0 group hover:bg-bg-card/60 transition-colors"
              >
                <span className="text-[12px] text-text-tertiary tabular-nums shrink-0 w-[120px]">
                  {p.dateLabel}
                </span>
                <span className="text-[15px] text-text-primary flex-1 group-hover:text-brand transition-colors">
                  {p.title}
                </span>
                <Pill className="self-start sm:self-auto">{p.tag}</Pill>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* ABOUT BLOCK */}
        <Reveal>
          <div className="mt-16 rounded-[24px] border-[0.5px] border-border bg-bg-card/40 p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10">
              <div>
                <div className="label-eyebrow mb-3">О проекте</div>
                <h2 className="text-[28px] lg:text-[36px] font-medium text-text-primary tracking-tight leading-[1.1]">
                  NEUROMEIN
                </h2>
              </div>
              <div>
                <p className="text-[16px] text-text-secondary leading-[1.65]">
                  Независимый аналитический ресурс об искусственном интеллекте
                  и его влиянии на рынок труда. Основан Андреем Майнгардтом
                  в 2022 году.
                </p>
                <p className="mt-4 text-[14px] text-text-tertiary leading-[1.65]">
                  Аудитория проекта — более 43 000 подписчиков в Telegram.
                </p>
                <div className="mt-7 flex gap-2 flex-wrap">
                  <Link
                    to="/about"
                    className="inline-flex items-center h-10 px-5 rounded-full border-[0.5px] border-border-strong text-[13px] text-text-primary hover:bg-bg-card transition-colors"
                  >
                    Подробнее обо мне
                  </Link>
                  <a
                    href={SITE.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center h-10 px-5 rounded-full bg-brand text-bg-deep text-[13px] font-medium hover:bg-brand-hover transition-colors"
                  >
                    Telegram-канал →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Layout>
  );
}

function SectionHeader({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: { to: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between gap-6 mt-20 mb-2">
      <div>
        <div className="label-eyebrow mb-3">{eyebrow}</div>
        <h2 className="text-[36px] lg:text-[48px] font-medium text-text-primary tracking-[-0.02em] leading-[1]">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          to={link.to}
          className="hidden sm:inline-flex items-center h-9 px-4 rounded-full border-[0.5px] border-border text-[13px] text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}
