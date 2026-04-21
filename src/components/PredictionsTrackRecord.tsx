import { motion } from "framer-motion";

type Stats = {
  total: number;
  byStatus: {
    fulfilled: number;
    partial: number;
    not_fulfilled: number;
    in_progress: number;
    too_early: number;
  };
  settled: number;
  accuracy: number | null;
};

// Цвета для distribution-полоски (соответствуют семантике статусов)
const STATUS_BAR = [
  { key: "fulfilled", label: "Сбылись", color: "#22C55E" },
  { key: "partial", label: "Частично", color: "#F59E0B" },
  { key: "not_fulfilled", label: "Не сбылись", color: "#EF4444" },
  { key: "in_progress", label: "В процессе", color: "#6366F1" },
  { key: "too_early", label: "Рано судить", color: "#52525B" },
] as const;

/**
 * Track Record — секция в стиле Stratechery / FT.
 * Не дашборд из тайлов, а editorial-обещание: «Я не правлю задним числом,
 * следующая сверка — такая-то дата».
 */
export function PredictionsTrackRecord({ stats }: { stats: Stats }) {
  const accuracyDisplay = stats.accuracy === null ? null : `${stats.accuracy}%`;

  return (
    <section
      aria-labelledby="track-record-heading"
      className="mt-20 sm:mt-28 pt-10 sm:pt-14 border-t border-white/8"
    >
      {/* Eyebrow */}
      <div
        className="text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase text-text-tertiary"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
      >
        Track record · обновлено ежемесячно
      </div>

      <div className="mt-5 grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-start">
        {/* Левая часть — заявление */}
        <div className="max-w-[640px]">
          <h2
            id="track-record-heading"
            className="text-[28px] sm:text-[36px] md:text-[44px] font-medium leading-[1.05] tracking-[-0.03em] text-text-primary text-balance"
          >
            {accuracyDisplay
              ? `Точность на сегодня — ${accuracyDisplay}`
              : "Точность пока не измерена"}
          </h2>
          <p className="mt-5 text-[14.5px] sm:text-[15.5px] text-text-secondary leading-[1.6]">
            {accuracyDisplay
              ? "Метрика считается как (сбылось + 0.5 × частично) / сверено. Прогнозы со статусом «в процессе» и «рано судить» не учитываются — это честная картина."
              : "Первая публичная сверка результатов запланирована на третий квартал 2026 года. До этого момента большинство прогнозов находится в статусе «в процессе» или «рано судить». Я не считаю накрученную точность за достижение."}
          </p>
        </div>

        {/* Правая часть — дистрибуция статусов */}
        <div className="lg:min-w-[440px] lg:max-w-[480px] w-full">
          <DistributionBar stats={stats} />
        </div>
      </div>

      {/* Checkpoint timeline — обещание */}
      <div className="mt-12 sm:mt-14 pt-8 border-t border-white/6">
        <div
          className="text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase text-text-tertiary mb-5"
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
        >
          Следующие сверки
        </div>
        <ol className="grid sm:grid-cols-3 gap-px bg-white/8 rounded-[14px] overflow-hidden border border-white/8">
          <Checkpoint
            date="2026-07-01"
            label="01 июля 2026"
            note="Полугодовая сверка статусов"
          />
          <Checkpoint
            date="2026-10-01"
            label="01 октября 2026"
            note="Q3-обзор + первая публичная точность"
          />
          <Checkpoint
            date="2027-01-01"
            label="01 января 2027"
            note="Годовой итог по прогнозам 2026"
          />
        </ol>

        <p className="mt-7 text-[12.5px] leading-[1.65] text-text-tertiary max-w-[680px]">
          Все прогнозы взяты из исследований «Тихая замена» (март 2026) и «ИИ в
          2025 и прогнозы на 2026» (январь 2026). Тексты прогнозов не
          редактируются после публикации; меняются только статусы и evidence.
          Машиночитаемая версия датасета доступна по{" "}
          <a
            href="/api/predictions.json"
            className="underline decoration-text-tertiary/40 underline-offset-4 hover:text-text-secondary transition-colors"
          >
            /api/predictions.json
          </a>{" "}
          (CC BY 4.0).
        </p>
      </div>
    </section>
  );
}

function DistributionBar({ stats }: { stats: Stats }) {
  const total = stats.total || 1;
  return (
    <div>
      {/* Health-bar */}
      <div
        className="flex h-3 w-full rounded-full overflow-hidden bg-white/4"
        role="img"
        aria-label={`Распределение статусов: всего ${stats.total} прогнозов`}
      >
        {STATUS_BAR.map((s) => {
          const count = stats.byStatus[s.key] ?? 0;
          if (count === 0) return null;
          const widthPct = (count / total) * 100;
          return (
            <motion.div
              key={s.key}
              initial={{ width: 0 }}
              whileInView={{ width: `${widthPct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: s.color }}
              title={`${s.label}: ${count}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <ul className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
        {STATUS_BAR.map((s) => {
          const count = stats.byStatus[s.key] ?? 0;
          return (
            <li key={s.key} className="flex items-center gap-2.5 min-w-0">
              <span
                aria-hidden
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: s.color }}
              />
              <span className="text-[12.5px] text-text-secondary truncate">
                {s.label}
              </span>
              <span className="ml-auto text-[12.5px] tabular-nums text-text-tertiary">
                {count}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Checkpoint({
  date,
  label,
  note,
}: {
  date: string;
  label: string;
  note: string;
}) {
  return (
    <li className="bg-bg-card/60 backdrop-blur-md p-5 sm:p-6 flex flex-col gap-1.5">
      <time
        dateTime={date}
        className="text-[14px] font-medium text-text-primary tracking-[-0.01em] tabular-nums"
      >
        {label}
      </time>
      <span className="text-[12.5px] text-text-tertiary leading-[1.45]">
        {note}
      </span>
    </li>
  );
}
