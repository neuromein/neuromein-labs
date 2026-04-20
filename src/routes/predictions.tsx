import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/HeroCard";
import { Pill } from "@/components/ui-bits";
import { Reveal } from "@/components/Reveal";
import {
  predictions,
  getStats,
  CATEGORIES,
  STATUS_LABELS,
  SOURCE_LABELS,
  type Prediction,
  type PredictionStatus,
  type SourceWork,
  type CategoryKey,
} from "@/data/predictions";

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

const STATUS_VARIANT: Record<PredictionStatus, "success" | "warn" | "info" | "fail" | "default"> = {
  fulfilled: "success",
  partial: "warn",
  in_progress: "info",
  not_fulfilled: "fail",
  too_early: "default",
};

const STATUS_ORDER: PredictionStatus[] = [
  "fulfilled",
  "partial",
  "in_progress",
  "too_early",
  "not_fulfilled",
];

function formatDate(iso: string): string {
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function PredictionsPage() {
  const [activeStatus, setActiveStatus] = useState<PredictionStatus | "all">("all");
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");
  const [activeSource, setActiveSource] = useState<SourceWork | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return predictions.filter((p) => {
      if (activeStatus !== "all" && p.status !== activeStatus) return false;
      if (activeCategory !== "all" && !p.categories.includes(activeCategory)) return false;
      if (activeSource !== "all" && p.source.work !== activeSource) return false;
      return true;
    });
  }, [activeStatus, activeCategory, activeSource]);

  const stats = useMemo(() => getStats(predictions), []);

  const usedCategories = useMemo(() => {
    const set = new Set<string>();
    predictions.forEach((p) => p.categories.forEach((c) => set.add(c)));
    return Array.from(set) as CategoryKey[];
  }, []);

  const usedSources = useMemo(() => {
    const set = new Set<SourceWork>();
    predictions.forEach((p) => set.add(p.source.work));
    return Array.from(set);
  }, []);

  return (
    <Layout>
      <div className="max-w-[1320px] mx-auto pb-20">
        <PageHero
          eyebrow="Prediction tracker"
          title="Прогнозы и их проверка"
          description="Я фиксирую прогнозы с датой и возвращаюсь к ним, чтобы проверить — сбылось или нет. Это единственный способ проверить аналитика."
        />

        {/* Stats */}
        <Reveal>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatCard label="Всего прогнозов" value={stats.total} />
            <StatCard label="Сбылось" value={stats.byStatus.fulfilled} accent="#4AE88C" />
            <StatCard label="Частично" value={stats.byStatus.partial} accent="#E8C84A" />
            <StatCard label="В процессе" value={stats.byStatus.in_progress} accent="#4A9EF5" />
            <StatCard
              label="Точность"
              value={stats.accuracy === null ? "—" : `${stats.accuracy}%`}
              hint={stats.accuracy === null ? "пока нет завершённых" : `${stats.settled} завершённых`}
            />
          </div>
        </Reveal>

        {/* Filters */}
        <Reveal delay={0.05}>
          <div className="mt-10 space-y-4">
            <FilterRow label="Статус">
              <FilterChip active={activeStatus === "all"} onClick={() => setActiveStatus("all")}>
                Все
              </FilterChip>
              {STATUS_ORDER.map((s) => (
                <FilterChip
                  key={s}
                  active={activeStatus === s}
                  onClick={() => setActiveStatus(s)}
                  count={stats.byStatus[s]}
                >
                  {STATUS_LABELS[s]}
                </FilterChip>
              ))}
            </FilterRow>

            <FilterRow label="Категория">
              <FilterChip
                active={activeCategory === "all"}
                onClick={() => setActiveCategory("all")}
              >
                Все
              </FilterChip>
              {usedCategories.map((c) => (
                <FilterChip
                  key={c}
                  active={activeCategory === c}
                  onClick={() => setActiveCategory(c)}
                >
                  {CATEGORIES[c]}
                </FilterChip>
              ))}
            </FilterRow>

            <FilterRow label="Источник">
              <FilterChip active={activeSource === "all"} onClick={() => setActiveSource("all")}>
                Все
              </FilterChip>
              {usedSources.map((s) => (
                <FilterChip
                  key={s}
                  active={activeSource === s}
                  onClick={() => setActiveSource(s)}
                >
                  {SOURCE_LABELS[s]}
                </FilterChip>
              ))}
            </FilterRow>
          </div>
        </Reveal>

        <p className="mt-8 text-[13px] text-text-tertiary">
          Прогнозы фиксируются публично с датой. Статусы обновляются 1-го числа каждого месяца, а
          также ad hoc — при значимых событиях.
        </p>

        {/* Cards */}
        <div className="mt-6 space-y-3">
          {filtered.length === 0 && (
            <div className="rounded-[20px] border-[0.5px] border-border bg-bg-card/40 p-10 text-center text-text-tertiary text-[14px]">
              По выбранным фильтрам ничего не найдено
            </div>
          )}
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.04}>
              <PredictionCard
                prediction={p}
                isOpen={expanded === p.id}
                onToggle={() => setExpanded(expanded === p.id ? null : p.id)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </Layout>
  );
}

function StatCard({
  label,
  value,
  accent,
  hint,
}: {
  label: string;
  value: string | number;
  accent?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-[16px] border-[0.5px] border-border bg-bg-card/40 p-5">
      <div
        className="text-[28px] font-semibold tracking-[-0.02em] leading-none"
        style={{ color: accent ?? "var(--color-text-primary)" }}
      >
        {value}
      </div>
      <div className="mt-2 text-[12px] text-text-tertiary uppercase tracking-[0.04em]">{label}</div>
      {hint && <div className="mt-1 text-[11px] text-text-tertiary/80">{hint}</div>}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 flex-wrap">
      <span className="text-[12px] uppercase tracking-[0.06em] text-text-tertiary pt-1.5 min-w-[80px]">
        {label}
      </span>
      <div className="flex flex-wrap gap-2 flex-1">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] border-[0.5px] transition-all duration-200 ${
        active
          ? "bg-text-primary text-bg border-text-primary"
          : "bg-transparent text-text-secondary border-border-strong hover:text-text-primary hover:border-text-tertiary"
      }`}
    >
      <span>{children}</span>
      {count !== undefined && count > 0 && (
        <span className={`text-[11px] ${active ? "opacity-60" : "text-text-tertiary"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function PredictionCard({
  prediction: p,
  isOpen,
  onToggle,
}: {
  prediction: Prediction;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const hasDetails = p.evidence.length > 0 || !!p.notes;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[20px] border-[0.5px] border-border bg-bg-card/40 p-6 lg:p-8 transition-colors duration-300 hover:border-border-strong hover:bg-bg-card/60"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <h3 className="text-[18px] text-text-primary font-medium leading-[1.4] tracking-[-0.01em]">
            {p.title}
          </h3>
          <p className="mt-3 text-[15px] text-text-secondary leading-[1.6]">{p.statement}</p>

          <div className="mt-5 flex items-center gap-2 flex-wrap">
            {p.categories.map((c) => (
              <span
                key={c}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] text-text-tertiary border-[0.5px] border-border"
              >
                {CATEGORIES[c as CategoryKey] ?? c}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 flex-wrap text-[12px] text-text-tertiary">
            <span>Прогноз: {formatDate(p.date_made)}</span>
            <span aria-hidden className="text-border-strong">·</span>
            <span>Горизонт: {p.target_horizon}</span>
            <span aria-hidden className="text-border-strong">·</span>
            <span>
              Источник: {p.source.work_title}
              {p.source.section && `, ${p.source.section}`}
              {p.source.page && `, с. ${p.source.page}`}
            </span>
          </div>
        </div>
        <Pill variant={STATUS_VARIANT[p.status]}>{STATUS_LABELS[p.status]}</Pill>
      </div>

      {hasDetails && (
        <button
          onClick={onToggle}
          className="mt-5 pt-5 border-t border-border w-full flex items-center justify-between text-[13px] text-text-secondary hover:text-text-primary transition-colors"
        >
          <span>
            {isOpen ? "Скрыть" : "Показать"} детали
            {p.evidence.length > 0 && ` · ${p.evidence.length} ${pluralEvidence(p.evidence.length)}`}
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      )}

      <AnimatePresence initial={false}>
        {isOpen && hasDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-5 space-y-4">
              {p.evidence.length > 0 && (
                <div>
                  <div className="text-[11px] uppercase tracking-[0.06em] text-text-tertiary mb-3">
                    Свидетельства
                  </div>
                  <ul className="space-y-3">
                    {p.evidence.map((ev, idx) => (
                      <li
                        key={idx}
                        className="rounded-[12px] border-[0.5px] border-border bg-bg/40 p-4"
                      >
                        <div className="text-[12px] text-text-tertiary mb-1.5">
                          {formatDate(ev.date)}
                        </div>
                        <div className="text-[14px] text-text-secondary leading-[1.55]">
                          {ev.note}
                        </div>
                        {ev.source_url && (
                          <a
                            href={ev.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-block text-[12px] text-brand hover:text-brand-hover transition-colors"
                          >
                            Источник →
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {p.notes && (
                <div>
                  <div className="text-[11px] uppercase tracking-[0.06em] text-text-tertiary mb-3">
                    Комментарий автора
                  </div>
                  <p className="text-[14px] text-text-secondary leading-[1.6] italic">{p.notes}</p>
                </div>
              )}

              <div className="text-[11px] text-text-tertiary/80">
                Статус обновлён: {formatDate(p.status_updated)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function pluralEvidence(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "свидетельство";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "свидетельства";
  return "свидетельств";
}
