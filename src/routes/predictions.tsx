import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageHeader, Pill } from "@/components/ui-bits";
import { Reveal } from "@/components/Reveal";
import { PREDICTIONS, type Prediction } from "@/lib/site";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "Прогнозы и их проверка — NEUROMEIN | Андрей Майнгардт" },
      {
        name: "description",
        content:
          "Публичный prediction tracker: фиксированные прогнозы Андрея Майнгардта о развитии ИИ и рынка труда с проверкой по срокам.",
      },
      { property: "og:title", content: "Прогнозы и их проверка — NEUROMEIN" },
      {
        property: "og:description",
        content: "Проверяемые прогнозы об ИИ и рынке труда с публичной сверкой результатов.",
      },
      { property: "og:url", content: "https://neuromein.ru/predictions" },
    ],
  }),
  component: PredictionsPage,
});

const STATUS_LABEL: Record<Prediction["status"], string> = {
  confirmed: "Подтверждён",
  partial: "Частично",
  in_progress: "В процессе",
  not_confirmed: "Не подтверждён",
};

const STATUS_VARIANT: Record<Prediction["status"], "success" | "warn" | "info" | "fail"> = {
  confirmed: "success",
  partial: "warn",
  in_progress: "info",
  not_confirmed: "fail",
};

function PredictionsPage() {
  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-6 lg:px-8 pt-20 pb-12">
        <Reveal>
          <PageHeader
            eyebrow="Prediction tracker"
            title="Прогнозы и их проверка"
            description="Я фиксирую прогнозы с датой и возвращаюсь к ним, чтобы проверить — сбылось или нет. Это единственный способ проверить аналитика."
          />
        </Reveal>

        <div className="mt-16 space-y-4">
          {PREDICTIONS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[10px] border-[0.5px] border-border bg-bg-card p-6 lg:p-7 transition-colors duration-300 hover:border-border-strong"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[260px]">
                    <p className="text-[16px] text-[#dddde5] font-medium leading-[1.5]">
                      {p.statement}
                    </p>
                    <div className="mt-4 flex items-center gap-3 flex-wrap text-[13px] text-text-tertiary">
                      <span>Прогноз: {p.madeOn}</span>
                      <span aria-hidden className="text-border-strong">·</span>
                      <span>Проверка: {p.checkBy}</span>
                    </div>
                  </div>
                  <Pill variant={STATUS_VARIANT[p.status]}>{STATUS_LABEL[p.status]}</Pill>
                </div>

                <div className="mt-5 pt-5 border-t border-border">
                  <a
                    href={p.sourceUrl}
                    target={p.sourceUrl.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="text-[13px] text-brand hover:text-brand-hover transition-colors"
                  >
                    Источник: {p.source}
                  </a>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>
    </Layout>
  );
}
