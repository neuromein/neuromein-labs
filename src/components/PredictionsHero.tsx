import { motion } from "framer-motion";

type Stats = {
  total: number;
  byStatus: Record<string, number>;
  settled: number;
  accuracy: number | null;
};

/**
 * Editorial-стиль hero для раздела «Прогнозы».
 * Стиль — FT / Stratechery: огромная живая метрика, eyebrow моно-шрифтом,
 * подзаголовок в первом лице. Никакого декоративного градиента в заголовке —
 * акцент только на цифрах. Всё структурировано <time> + tabular-nums для AI.
 */
export function PredictionsHero({ stats }: { stats: Stats }) {
  const accuracyDisplay = stats.accuracy === null ? "—" : `${stats.accuracy}%`;

  return (
    <header className="pt-8 sm:pt-12 md:pt-16">
      {/* Eyebrow — мелкий моно-шрифт */}
      <div
        className="text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase text-text-tertiary"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
      >
        Public prediction tracker · v2.0
      </div>

      {/* Главный заголовок — без градиента, чистая типографика */}
      <h1 className="mt-5 sm:mt-6 text-[34px] sm:text-[48px] md:text-[64px] lg:text-[78px] font-medium leading-[1.0] tracking-[-0.04em] text-text-primary text-balance max-w-[1100px]">
        Я фиксирую прогнозы публично.{" "}
        <span className="text-text-tertiary">
          Через 3, 6, 12 месяцев — проверяю.
        </span>
      </h1>

      <p className="mt-6 sm:mt-7 text-[15px] sm:text-[16.5px] md:text-[17.5px] text-text-secondary leading-[1.55] max-w-[640px]">
        Без правок задним числом. Каждый прогноз привязан к исходному
        исследованию, дате публикации и квартальному горизонту. Статус
        обновляется первого числа каждого месяца.
      </p>

      {/* Live metric bar — FT / Stratechery стиль */}
      <motion.dl
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="mt-10 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-7 sm:gap-x-10 max-w-[820px]"
      >
        <Metric label="Прогнозов" value={stats.total} />
        <Metric
          label="Горизонт"
          value={
            <>
              <time dateTime="2026">2026</time>
              <span className="text-text-tertiary mx-1">–</span>
              <time dateTime="2028">28</time>
            </>
          }
        />
        <Metric
          label="Сверено"
          value={stats.settled}
          hint={`из ${stats.total}`}
        />
        <Metric
          label="Точность"
          value={accuracyDisplay}
          hint={
            stats.accuracy === null
              ? "первая сверка Q3 2026"
              : "обновляется ежемесячно"
          }
        />
      </motion.dl>
    </header>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col">
      <dt
        className="text-[10.5px] sm:text-[11px] tracking-[0.14em] uppercase text-text-tertiary font-medium"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
      >
        {label}
      </dt>
      <dd
        className="mt-2 text-[36px] sm:text-[44px] md:text-[52px] font-medium leading-[0.95] tracking-[-0.035em] text-text-primary tabular-nums"
        style={{ fontFeatureSettings: '"tnum", "ss01"' }}
      >
        {value}
      </dd>
      {hint && (
        <span className="mt-2 text-[12px] text-text-tertiary leading-[1.4]">
          {hint}
        </span>
      )}
    </div>
  );
}
