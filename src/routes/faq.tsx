import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/HeroCard";
import { Reveal } from "@/components/Reveal";

const FAQ = [
  {
    q: "Что такое «тихая замена»?",
    a: "Тихая замена – это процесс, при котором ИИ-инструменты постепенно берут на себя отдельные функции внутри существующих должностей. Людей не увольняют – но объём их реальной работы сокращается, и со временем позиция становится избыточной.",
  },
  {
    q: "Какие профессии ИИ заменит первыми?",
    a: "В первую очередь трансформируются профессии, где основная работа – обработка информации по шаблону: аналитики начального уровня, копирайтеры, переводчики, операторы поддержки, младшие бухгалтеры.",
  },
  {
    q: "Как подготовить бизнес к ИИ-автоматизации?",
    a: "Начните с аудита: какие функции в вашей команде уже могут быть переданы ИИ-инструментам? Определите 2–3 процесса, где AI даёт измеримый результат, и начните с них.",
  },
  {
    q: "Какие навыки будут востребованы в 2027–2030?",
    a: "Управление AI-инструментами, постановка задач для нейросетей, критическое мышление при работе с AI-выводами, навыки в области физического контакта или сложных переговоров.",
  },
  {
    q: "Чем замещение отличается от автоматизации?",
    a: "Автоматизация убирает целые процессы. Замещение – тоньше: ИИ берёт на себя часть функций внутри должности, оставляя человека на месте, но с уменьшающимся объёмом работы.",
  },
  {
    q: "Кто такой Андрей Майнгардт?",
    a: "Эксперт по влиянию ИИ на бизнес-процессы и рынок труда, основатель аналитического ресурса NEUROMEIN (45 000+ подписчиков), Director of Strategy в компании WMT AI. Автор исследования «Тихая замена» и отчёта «ИИ в 2025 и прогнозы на 2026». Специализируется на анализе влияния ИИ на рынок труда и стратегическом внедрении ИИ в бизнес.",
  },
  {
    q: "Где следить за обновлениями?",
    a: "Основной канал – Telegram: t.me/neuromein. Также публикую в LinkedIn (Andrew Meinhardt).",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Частые вопросы – NEUROMEIN | Андрей Майнгардт" },
      {
        name: "description",
        content:
          "Ответы на ключевые вопросы о влиянии ИИ на рынок труда: тихая замена, автоматизация, востребованные навыки.",
      },
      { property: "og:title", content: "Частые вопросы – NEUROMEIN" },
      {
        property: "og:description",
        content: "Ответы на ключевые вопросы о влиянии ИИ на рынок труда.",
      },
      { property: "og:url", content: "https://neuromein.ru/faq" },
    ],
    links: [
      { rel: "canonical", href: "https://neuromein.ru/faq" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Layout>
      <div className="max-w-[1320px] mx-auto pb-20">
        <PageHero
          eyebrow="Часто задаваемые вопросы"
          title="Частые вопросы"
          description="Ответы на ключевые вопросы о влиянии ИИ на рынок труда и о моей работе."
        />

        <div className="mt-6 rounded-[24px] border-[0.5px] border-border bg-bg-card/40 overflow-hidden">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.04}>
                <div className="border-b border-border last:border-b-0">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-start justify-between gap-6 px-6 lg:px-10 py-7 text-left group hover:bg-bg-card/40 transition-colors"
                  >
                    <span className="text-[18px] text-text-primary group-hover:text-brand transition-colors leading-[1.4] tracking-tight">
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-0.5 flex-shrink-0 text-text-tertiary text-2xl leading-none"
                      aria-hidden
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 lg:px-10 pb-7 pr-12 text-[16px] text-text-secondary leading-[1.7] max-w-[800px]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
