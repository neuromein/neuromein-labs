import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { PredictionsValidationBanner } from "@/components/PredictionsValidationBanner";
import { PredictionsTimeline } from "@/components/PredictionsTimeline";
import { predictions, getStats } from "@/data/predictions";

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

function PredictionsPage() {
  const stats = useMemo(() => getStats(predictions), []);

  return (
    <Layout>
      <div className="max-w-[1320px] mx-auto pb-20 pt-6">
        <PredictionsValidationBanner />

        {/* Summary stats — moved above the interactive timeline */}
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px rounded-[24px] overflow-hidden border-[0.5px] border-border bg-border">
            <StatTile label="Всего" value={stats.total} />
            <StatTile label="Сбылось" value={stats.byStatus.fulfilled} />
            <StatTile label="Частично" value={stats.byStatus.partial} />
            <StatTile label="В процессе" value={stats.byStatus.in_progress} />
            <StatTile
              label="Точность"
              value={stats.accuracy === null ? "—" : `${stats.accuracy}%`}
            />
          </div>
        </Reveal>

        {/* Main content — interactive timeline + filters + cards */}
        <PredictionsTimeline />
      </div>
    </Layout>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-bg-card/60 backdrop-blur-md p-6 lg:p-7 h-[140px] flex flex-col justify-between transition-colors duration-300 hover:bg-bg-card/80">
      <div className="text-[11px] text-text-tertiary uppercase tracking-[0.08em] font-medium">
        {label}
      </div>
      <div className="text-[40px] font-semibold tracking-[-0.03em] leading-none text-text-primary tabular-nums">
        {value}
      </div>
    </div>
  );
}
