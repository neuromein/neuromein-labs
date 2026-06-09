import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { PredictionsTimeline } from "@/components/PredictionsTimeline";
import { getStats, type Prediction } from "@/data/predictions";
import { fetchPredictions } from "@/data/predictions.fetch";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "Прогнозы и их проверка – NEUROMEIN | Андрей Майнгардт" },
      {
        name: "description",
        content:
          "Публичный prediction tracker: фиксированные прогнозы Андрея Майнгардта о развитии ИИ и рынка труда с проверкой по срокам.",
      },
      { property: "og:title", content: "Прогнозы и их проверка – NEUROMEIN" },
      {
        property: "og:description",
        content: "Проверяемые прогнозы об ИИ и рынке труда с публичной сверкой результатов.",
      },
      { property: "og:url", content: "https://neuromein.ru/predictions" },
    ],
    links: [
      { rel: "canonical", href: "https://neuromein.ru/predictions" },
    ],
  }),
  loader: () => fetchPredictions(),
  component: PredictionsPage,
});

function PredictionsPage() {
  const initial = Route.useLoaderData() as Prediction[];
  const [predictions, setPredictions] = useState<Prediction[]>(initial);

  // Realtime: re-fetch on any change to predictions or evidence
  useEffect(() => {
    let cancelled = false;
    const refetch = async () => {
      try {
        const next = await fetchPredictions();
        if (!cancelled) setPredictions(next);
      } catch (e) {
        console.error("predictions refetch failed", e);
      }
    };
    const channel = supabase
      .channel("predictions-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "predictions" }, refetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "prediction_evidence" }, refetch)
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  const stats = useMemo(() => getStats(predictions), [predictions]);

  return (
    <Layout>
      <div className="max-w-[1320px] mx-auto pb-24 pt-4 px-4 sm:px-6 lg:px-8">
        <PredictionsTimeline predictions={predictions} />

        <Reveal>
          <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-px rounded-[20px] sm:rounded-[24px] overflow-hidden border-[0.5px] border-border bg-border">
            <StatTile label="Всего" value={stats.total} />
            <StatTile label="Сбылось" value={stats.byStatus.fulfilled} />
            <StatTile label="Частично" value={stats.byStatus.partial} />
            <StatTile label="Не сбылось" value={stats.byStatus.not_fulfilled} />
            <StatTile label="В процессе" value={stats.byStatus.in_progress} />
            <StatTile
              label="Точность"
              value={stats.accuracy === null ? "–" : `${stats.accuracy}%`}
            />
          </div>

          <p className="mt-6 text-[13px] leading-[1.65] text-text-tertiary max-w-2xl">
            Все прогнозы основаны на исследованиях «Тихая замена» (март 2026) и «ИИ в
            2025 и прогнозы на 2026» (январь 2026). Уровень уверенности отражает
            сочетание данных, моделирования и экспертной оценки. Статистика обновляется
            автоматически по мере изменения статусов в источнике данных.
          </p>
        </Reveal>
      </div>
    </Layout>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-bg-card/60 backdrop-blur-md p-4 sm:p-5 lg:p-6 h-[100px] sm:h-[120px] flex flex-col justify-between transition-colors duration-300 hover:bg-bg-card/80">
      <div className="text-[10px] sm:text-[11px] text-text-tertiary uppercase tracking-[0.08em] font-medium">
        {label}
      </div>
      <div className="text-[28px] sm:text-[36px] font-semibold tracking-[-0.03em] leading-none text-text-primary tabular-nums">
        {value}
      </div>
    </div>
  );
}
