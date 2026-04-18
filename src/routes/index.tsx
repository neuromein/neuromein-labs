import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { HeroCard } from "@/components/HeroCard";
import { Reveal } from "@/components/Reveal";
import { ResearchShowcase } from "@/components/ResearchShowcase";
import { PublicationsList } from "@/components/PublicationsList";
import { SITE } from "@/lib/site";

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

        <ResearchShowcase />

        {/* PUBLICATIONS */}
        <Reveal>
          <SectionHeader
            eyebrow="Заметки"
            title="Публикации"
            link={{ to: "/blog", label: "Все публикации" }}
          />
        </Reveal>

        <PublicationsList />

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
