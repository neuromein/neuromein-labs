import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
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
  // Parse ISO date manually (YYYY-MM-DD) to avoid timezone-driven SSR/CSR mismatch
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const year = Number(m[1]);
  const monthIdx = Number(m[2]) - 1;
  const day = Number(m[3]);
  if (monthIdx < 0 || monthIdx > 11) return iso;
  return `${day} ${months[monthIdx]} ${year}`;
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
          title="Прогнозы и их проверка"
          description="Я фиксирую прогнозы с датой и возвращаюсь к ним, чтобы проверить — сбылось или нет."
        />

        {/* Stats — monochrome, equal-weight tiles */}
        <Reveal>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-px rounded-[24px] overflow-hidden border-[0.5px] border-border bg-border">
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

        {/* Filters — collapsible panel */}
        <Reveal delay={0.05}>
          <FiltersPanel
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeSource={activeSource}
            setActiveSource={setActiveSource}
            stats={stats}
            usedCategories={usedCategories}
            usedSources={usedSources}
          />
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

function StatTile({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
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

type FilterOption = { key: string; label: string; count?: number };

function FilterCapsule({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <span className="text-[11px] uppercase tracking-[0.08em] text-text-tertiary font-medium min-w-[88px]">
        {label}
      </span>
      <div
        className="inline-flex items-center gap-0.5 p-1 rounded-full flex-wrap"
        style={{
          background: "rgba(12, 12, 18, 0.55)",
          backdropFilter: "blur(22px) saturate(160%)",
          WebkitBackdropFilter: "blur(22px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow:
            "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {options.map((opt) => {
          const isActive = active === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onChange(opt.key)}
              className={`relative px-3.5 py-2 rounded-full text-[13px] whitespace-nowrap transition-colors duration-200 ${
                isActive
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={`filter-pill-${label}`}
                  className="absolute inset-0 rounded-full bg-bg-deep"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative inline-flex items-center gap-1.5">
                {opt.label}
                {opt.count !== undefined && opt.count > 0 && (
                  <span
                    className={`text-[10px] font-medium ${
                      isActive ? "text-text-tertiary" : "text-text-tertiary/70"
                    }`}
                  >
                    {opt.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
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
