import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/ui-bits";
import { Reveal } from "@/components/Reveal";

const FAQ = [
  {
    q: "Что такое «тихая замена»?",
    a: "Тихая замена — это процесс, при котором ИИ-инструменты постепенно берут на себя отдельные функции внутри существующих должностей. Людей не увольняют — но объём их реальной работы сокращается, и со временем позиция становится избыточной. Подробнее — в исследовании «Тихая замена».",
  },
  {
    q: "Какие профессии ИИ заменит первыми?",
    a: "В первую очередь трансформируются профессии, где основная работа — обработка информации по шаблону: аналитики начального уровня, копирайтеры, переводчики, операторы поддержки, младшие бухгалтеры. Важно: замена чаще всего происходит не целиком, а по функциям.",
  },
  {
    q: "Как подготовить бизнес к ИИ-автоматизации?",
    a: "Начните с аудита: какие функции в вашей команде уже могут быть переданы ИИ-инструментам? Не пытайтесь автоматизировать всё сразу — определите 2–3 процесса, где AI даёт измеримый результат, и начните с них.",
  },
  {
    q: "Какие навыки будут востребованы в 2027–2030?",
    a: "Управление AI-инструментами, постановка задач для нейросетей, критическое мышление при работе с AI-выводами, навыки в области, где нужен физический контакт или сложные переговоры. Подробнее — в отчёте «ИИ в 2025 и прогнозы на 2026».",
  },
  {
    q: "Чем замещение отличается от автоматизации?",
    a: "Автоматизация убирает целые процессы. Замещение — тоньше: ИИ берёт на себя часть функций внутри должности, оставляя человека на месте, но с уменьшающимся объёмом работы. Это создаёт иллюзию стабильности, но на деле профессия выхолащивается изнутри.",
  },
  {
    q: "Кто такой Андрей Майнгардт?",
    a: "Независимый AI-аналитик, основатель аналитического ресурса NEUROMEIN.AI (43 000+ подписчиков), AI Strategist в компании WMT AI. Автор исследования «Тихая замена» и отчёта «ИИ в 2025 и прогнозы на 2026». Специализируется на анализе влияния ИИ на рынок труда.",
  },
  {
    q: "Где следить за обновлениями?",
    a: "Основной канал — Telegram: t.me/neuromein. Также публикую в LinkedIn (Andrew Meinhardt) и Instagram (@neuromein.ai).",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Частые вопросы — NEUROMEIN | Андрей Майнгардт" },
      {
        name: "description",
        content:
          "Ответы на ключевые вопросы о влиянии ИИ на рынок труда: тихая замена, автоматизация, востребованные навыки.",
      },
      { property: "og:title", content: "Частые вопросы — NEUROMEIN" },
      {
        property: "og:description",
        content: "Ответы на ключевые вопросы о влиянии ИИ на рынок труда.",
      },
      { property: "og:url", content: "https://neuromein.ru/faq" },
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
      <section className="max-w-3xl mx-auto px-6 lg:px-8 pt-20 pb-12">
        <Reveal>
          <PageHeader
            eyebrow="FAQ"
            title="Частые вопросы"
            description="Ответы на ключевые вопросы о влиянии ИИ на рынок труда."
          />
        </Reveal>

        <div className="mt-14 border-t border-border">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.05}>
                <div className="border-b border-border">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                  >
                    <span className="text-[16px] text-[#dddde5] group-hover:text-text-primary transition-colors leading-[1.45]">
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-1 flex-shrink-0 text-text-tertiary text-2xl leading-none"
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
                        <p className="pb-6 pr-10 text-[15px] text-text-secondary leading-[1.7]">
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
      </section>
    </Layout>
  );
}
