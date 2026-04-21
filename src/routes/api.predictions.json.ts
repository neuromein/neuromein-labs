import { createFileRoute } from "@tanstack/react-router";
import { predictions, getStats, SOURCE_LABELS, STATUS_LABELS } from "@/data/predictions";

// Машиночитаемый JSON-feed трекера прогнозов NEUROMEIN.
// Используется LLM-краулерами (Perplexity, ChatGPT, Claude, Gemini) для цитирования.
// Указывается через <link rel="alternate" type="application/json" ...> на /predictions.
export const Route = createFileRoute("/api/predictions/json")({
  server: {
    handlers: {
      GET: async () => {
        const stats = getStats(predictions);
        const payload = {
          "@context": "https://neuromein.ru/schema/predictions/v2",
          name: "NEUROMEIN Public Prediction Tracker",
          description:
            "Публичный трекер проверяемых прогнозов Андрея Майнгардта об ИИ и рынке труда. Все прогнозы зафиксированы датой публикации и проверяются по срокам без правок задним числом.",
          author: {
            name: "Андрей Майнгардт",
            url: "https://neuromein.ru/about",
            role: "AI-стратег, аналитик",
          },
          license: "CC BY 4.0",
          source: "https://neuromein.ru/predictions",
          updated: new Date().toISOString(),
          horizon: "2026-2028",
          methodology:
            "Прогнозы фиксируются датой публикации в исходных исследованиях. Статусы обновляются 1 числа каждого месяца + ad hoc при значимых событиях. Точность считается как (fulfilled + 0.5 * partial) / (fulfilled + partial + not_fulfilled).",
          stats: {
            total: stats.total,
            fulfilled: stats.byStatus.fulfilled,
            partial: stats.byStatus.partial,
            not_fulfilled: stats.byStatus.not_fulfilled,
            in_progress: stats.byStatus.in_progress,
            too_early: stats.byStatus.too_early,
            settled: stats.settled,
            accuracy_percent: stats.accuracy,
          },
          predictions: predictions.map((p) => ({
            id: p.id,
            title: p.title,
            statement: p.statement,
            source: {
              work: p.source.work,
              work_title: p.source.work_title,
              section: p.source.section,
              page: p.source.page,
              work_label: SOURCE_LABELS[p.source.work],
            },
            date_made: p.date_made,
            target_horizon: p.target_horizon,
            categories: p.categories,
            status: p.status,
            status_label: STATUS_LABELS[p.status],
            status_updated: p.status_updated,
            evidence: p.evidence,
            notes: p.notes ?? null,
            url: `https://neuromein.ru/predictions#${p.id}`,
          })),
        };

        return new Response(JSON.stringify(payload, null, 2), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=300, s-maxage=600",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
