import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, FileText } from "lucide-react";
import {
  predictions,
  type Prediction,
  type CategoryKey,
} from "@/data/predictions";

// ============================================================================
// Конфиг визуального стиля (emerald + blue, на тёмном фоне сайта)
// ============================================================================

const EMERALD = "#10B981";
const BLUE = "#3B82F6";
const CRISIS_RED = "#7F1D1D";

// ============================================================================
// Тематические группы (фильтры для timeline)
// ============================================================================

type ThemeKey =
  | "all"
  | "labor"
  | "tech_ai"
  | "geo_crises"
  | "bio_health"
  | "society_edu";

const THEME_LABELS: Record<ThemeKey, string> = {
  all: "Все",
  labor: "Рынок труда",
  tech_ai: "Технологии и ИИ",
  geo_crises: "Геополитика и кризисы",
  bio_health: "Био и здоровье",
  society_edu: "Общество и образование",
};

const CATEGORY_TO_THEME: Partial<Record<CategoryKey, ThemeKey>> = {
  labor_market: "labor",
  business_models: "labor",
  ai_models: "tech_ai",
  enterprise_ai: "tech_ai",
  robotics: "tech_ai",
  cybersecurity: "tech_ai",
  geopolitics: "geo_crises",
  macroeconomy: "geo_crises",
  risks: "geo_crises",
  science: "bio_health",
  education: "society_edu",
  society: "society_edu",
  media_marketing: "society_edu",
  regulation: "society_edu",
};

function predictionThemes(p: Prediction): ThemeKey[] {
  const set = new Set<ThemeKey>();
  p.categories.forEach((c) => {
    const t = CATEGORY_TO_THEME[c as CategoryKey];
    if (t) set.add(t);
  });
  return Array.from(set);
}

// ============================================================================
// Курируемая выборка 12–15 «самых сильных» прогнозов
// + краткое описание + горизонт + уверенность + квартал на шкале
// ============================================================================

type Quarter = `Q${1 | 2 | 3 | 4} ${2026 | 2027 | 2028}`;

interface CuratedItem {
  id: string; // id из predictions.ts
  shortTitle: string;
  shortDescription: string;
  horizon: string;
  confidence: number; // 0–100
  sourceLabel: string;
  pdfUrl?: string;
  quarter: Quarter; // позиция на шкале
}

const PDF_SILENT = "/research/tihaya-zamena.pdf";
const PDF_AI2025 = "/research/ai-2025-forecast.pdf";

const CURATED: CuratedItem[] = [
  {
    id: "pred-001",
    shortTitle: "DeepSeek R2/V4: новый стандарт оптимизации",
    shortDescription:
      "Китайские сверхэффективные модели на Ascend снизят стоимость агентов и робототехники на 50–80%.",
    horizon: "Q1–Q2 2026",
    confidence: 80,
    sourceLabel: "ИИ в 2025, §2.1",
    pdfUrl: PDF_AI2025,
    quarter: "Q1 2026",
  },
  {
    id: "pred-003",
    shortTitle: "Конец SaaS: Agent-as-a-Service",
    shortDescription:
      "Вендоры начнут продавать единицы готового труда — оплата за результат, а не за лицензию.",
    horizon: "Конец 2026",
    confidence: 70,
    sourceLabel: "ИИ в 2025, §2.2",
    pdfUrl: PDF_AI2025,
    quarter: "Q4 2026",
  },
  {
    id: "pred-007",
    shortTitle: "«Ловушка джуниора»",
    shortDescription:
      "ИИ заменяет задачи, через которые молодые специалисты входили в профессию — цепочка опыта рвётся.",
    horizon: "В течение 2026",
    confidence: 85,
    sourceLabel: "ИИ в 2025, §2.3",
    pdfUrl: PDF_AI2025,
    quarter: "Q2 2026",
  },
  {
    id: "pred-008",
    shortTitle: "Цифровые двойники и элитизация живого",
    shortDescription:
      "Аватары проходят тест Тьюринга в видео; живое общение становится премиальным сервисом.",
    horizon: "В течение 2026",
    confidence: 65,
    sourceLabel: "ИИ в 2025, §2.3",
    pdfUrl: PDF_AI2025,
    quarter: "Q3 2026",
  },
  {
    id: "pred-013",
    shortTitle: "Год «физического ИИ»",
    shortDescription:
      "Облачно-бортовая архитектура VLA, 5-й уровень автономности, заводы Tesla и BMW как полигоны.",
    horizon: "Конец 2026",
    confidence: 70,
    sourceLabel: "ИИ в 2025, §2.4",
    pdfUrl: PDF_AI2025,
    quarter: "Q4 2026",
  },
  {
    id: "pred-014",
    shortTitle: "Войны дронов как доминирующий формат",
    shortDescription:
      "Беспилотные системы достигают операционной зрелости; первые удары по гиперскейл-облакам.",
    horizon: "В течение 2026",
    confidence: 75,
    sourceLabel: "ИИ в 2025, §2.4",
    pdfUrl: PDF_AI2025,
    quarter: "Q2 2026",
  },
  {
    id: "pred-015",
    shortTitle: "Закат SEO, рассвет GEO",
    shortDescription:
      "Бренды переходят от топа выдачи к интеграции в прямой ответ ИИ; дизайн сайтов — под машины.",
    horizon: "Конец 2026",
    confidence: 80,
    sourceLabel: "ИИ в 2025, §2.5",
    pdfUrl: PDF_AI2025,
    quarter: "Q3 2026",
  },
  {
    id: "pred-010",
    shortTitle: "«Ножницы навыков»",
    shortDescription:
      "Обязательное владение ИИ + входное тестирование на безалгоритмическое мышление.",
    horizon: "К 2027",
    confidence: 65,
    sourceLabel: "ИИ в 2025, §2.3",
    pdfUrl: PDF_AI2025,
    quarter: "Q1 2027",
  },
  {
    id: "pred-027",
    shortTitle: "Каскад кризисов 2026–2027",
    shortDescription:
      "Tech-коррекция, геополитическое обострение и рецессия — реальность опередила график.",
    horizon: "Q2 2026 — середина 2027",
    confidence: 90,
    sourceLabel: "Тихая замена, §6.3",
    pdfUrl: PDF_SILENT,
    quarter: "Q2 2027",
  },
  {
    id: "pred-028",
    shortTitle: "Военный конфликт с макровоздействием",
    shortDescription:
      "Вероятность хотя бы одного конфликта (Ближний Восток / Тайвань / Европа) — 90% к 2028.",
    horizon: "2026–2028",
    confidence: 90,
    sourceLabel: "Тихая замена, гл. 4",
    pdfUrl: PDF_SILENT,
    quarter: "Q3 2027",
  },
  {
    id: "pred-030",
    shortTitle: "Опережающее разрушение рабочих мест",
    shortDescription:
      "Места исчезают до фактической замены — рынок и инвесторы режут штат на ожиданиях.",
    horizon: "2026–2028",
    confidence: 85,
    sourceLabel: "Тихая замена, гл. 5",
    pdfUrl: PDF_SILENT,
    quarter: "Q4 2026",
  },
  {
    id: "pred-032",
    shortTitle: "Рынок труда — «гантель»",
    shortDescription:
      "Сверху — операторы ИИ, снизу — нестандартный физический труд, в середине — пустота.",
    horizon: "До 2028",
    confidence: 75,
    sourceLabel: "Тихая замена, §7.4",
    pdfUrl: PDF_SILENT,
    quarter: "Q4 2027",
  },
  {
    id: "pred-033",
    shortTitle: "Гуманоиды дешевле зарплаты складского рабочего",
    shortDescription:
      "Tesla, Figure, Boston Dynamics, Unitree давят на нижнюю перекладину «гантели».",
    horizon: "2028+",
    confidence: 60,
    sourceLabel: "Тихая замена, §7.4",
    pdfUrl: PDF_SILENT,
    quarter: "Q2 2028",
  },
  {
    id: "pred-034",
    shortTitle: "Эффект односторонней двери",
    shortDescription:
      "Сокращённых в кризис не вернут — позиции займут ИИ-сотрудники до восстановления экономики.",
    horizon: "2027–2029",
    confidence: 80,
    sourceLabel: "Тихая замена, §3.4, §6.3",
    pdfUrl: PDF_SILENT,
    quarter: "Q3 2028",
  },
  {
    id: "pred-031",
    shortTitle: "Пандемия ускорит автоматизацию интеллектуального труда",
    shortDescription:
      "Следующая пандемия снимет социальное сопротивление замене — ИИ не уходит на больничный.",
    horizon: "2027–2028",
    confidence: 55,
    sourceLabel: "Тихая замена, гл. 5",
    pdfUrl: PDF_SILENT,
    quarter: "Q1 2028",
  },
];

// ============================================================================
// Шкала кварталов: Q1 2026 → Q4 2028 (12 точек)
// ============================================================================

const QUARTERS: Quarter[] = [
  "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026",
  "Q1 2027", "Q2 2027", "Q3 2027", "Q4 2027",
  "Q1 2028", "Q2 2028", "Q3 2028", "Q4 2028",
];

// «Пиковые кризисы» по тексту работ: Q2 2026 — середина 2027 и Q4 2027 — Q1 2028
const CRISIS_RANGES: Array<[number, number]> = [
  [1, 5], // Q2 2026 → Q2 2027
  [7, 9], // Q4 2027 → Q2 2028
];

function quarterIndex(q: Quarter): number {
  return QUARTERS.indexOf(q);
}

function isCrisisIndex(i: number): boolean {
  return CRISIS_RANGES.some(([a, b]) => i >= a && i <= b);
}

// ============================================================================
// Утилиты для уверенности
// ============================================================================

function confidenceColor(c: number): string {
  if (c >= 75) return EMERALD;
  if (c >= 55) return "#F59E0B";
  return "#EF4444";
}

function confidenceLabel(c: number): string {
  if (c >= 75) return "Высокая";
  if (c >= 55) return "Средняя";
  return "Спекулятивная";
}

// ============================================================================
// Главный компонент
// ============================================================================

export function PredictionsTimeline() {
  const [theme, setTheme] = useState<ThemeKey>("all");
  const [activeQuarterIdx, setActiveQuarterIdx] = useState<number | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  // соединяем curated с полным prediction по id
  const merged = useMemo(() => {
    const byId = new Map(predictions.map((p) => [p.id, p]));
    return CURATED
      .map((c) => {
        const full = byId.get(c.id);
        if (!full) return null;
        return { curated: c, full, themes: predictionThemes(full) };
      })
      .filter((x): x is { curated: CuratedItem; full: Prediction; themes: ThemeKey[] } => !!x);
  }, []);

  const filtered = useMemo(() => {
    return merged.filter((m) => theme === "all" || m.themes.includes(theme));
  }, [merged, theme]);

  const filteredOnQuarter = useMemo(() => {
    if (activeQuarterIdx === null) return filtered;
    const q = QUARTERS[activeQuarterIdx];
    return filtered.filter((m) => m.curated.quarter === q);
  }, [filtered, activeQuarterIdx]);

  // Подсчёт точек на каждом квартале (для текущего фильтра по теме)
  const quarterCounts = useMemo(() => {
    const arr = new Array(QUARTERS.length).fill(0) as number[];
    filtered.forEach((m) => {
      const i = quarterIndex(m.curated.quarter);
      if (i >= 0) arr[i] += 1;
    });
    return arr;
  }, [filtered]);

  const openItem = openId
    ? merged.find((m) => m.curated.id === openId) ?? null
    : null;

  return (
    <section
      aria-labelledby="timeline-heading"
      className="mt-4"
    >
      {/* Заголовок — editorial style */}
      <header className="max-w-4xl border-t border-white/10 pt-8">
        <div className="flex items-baseline gap-4 mb-6 text-[11px] uppercase tracking-[0.18em] text-text-tertiary font-mono">
          <span>2026 — 2028</span>
          <span className="text-white/20">/</span>
          <span>Forecast Tracker</span>
        </div>
        <h2
          id="timeline-heading"
          className="text-[36px] md:text-[52px] lg:text-[64px] font-medium leading-[0.98] tracking-[-0.035em] text-text-primary text-balance"
        >
          Прогнозы 2026–2028 и их проверка
        </h2>
        <p className="mt-6 text-[15px] md:text-[17px] text-text-secondary leading-[1.55] max-w-[640px]">
          Шкала на основе исследований «Тихая замена» и «ИИ в 2025». Каждый прогноз
          привязан к кварталу и сопровождается уровнем уверенности.
        </p>
      </header>

      {/* Фильтры — editorial tabs */}
      <div className="mt-12 border-t border-white/10">
        <div className="flex flex-wrap items-stretch -mb-px">
          {(Object.keys(THEME_LABELS) as ThemeKey[]).map((k) => {
            const isActive = theme === k;
            return (
              <button
                key={k}
                onClick={() => setTheme(k)}
                className="relative px-5 py-4 text-[12px] uppercase tracking-[0.1em] font-medium transition-colors whitespace-nowrap"
                style={{
                  color: isActive ? "#fff" : "rgba(240,240,245,0.45)",
                }}
              >
                {THEME_LABELS[k]}
                {isActive && (
                  <motion.span
                    layoutId="theme-underline"
                    className="absolute left-0 right-0 -top-px h-px bg-white"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <Timeline
        counts={quarterCounts}
        activeIdx={activeQuarterIdx}
        onSelect={(i) =>
          setActiveQuarterIdx((cur) => (cur === i ? null : i))
        }
        getItemsAt={(i) =>
          filtered.filter((m) => quarterIndex(m.curated.quarter) === i)
        }
        onOpen={(id) => setOpenId(id)}
      />

      {/* Сетка карточек */}
      <div className="mt-16 border-t border-white/10 pt-8">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-baseline gap-3">
            <span className="text-[11px] uppercase tracking-[0.18em] text-text-tertiary font-mono">
              {activeQuarterIdx !== null
                ? QUARTERS[activeQuarterIdx]
                : "All forecasts"}
            </span>
            <span className="text-[11px] tabular-nums text-text-tertiary">
              ({filteredOnQuarter.length})
            </span>
          </div>
          {activeQuarterIdx !== null && (
            <button
              onClick={() => setActiveQuarterIdx(null)}
              className="text-[11px] uppercase tracking-[0.12em] text-text-tertiary hover:text-text-primary transition-colors inline-flex items-center gap-1.5"
            >
              <X size={11} /> Сбросить
            </button>
          )}
        </div>

        <motion.div
          layout
          className="grid gap-px bg-white/10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch border border-white/10"
        >
          <AnimatePresence mode="popLayout">
            {filteredOnQuarter.map((m) => (
              <motion.div
                key={m.curated.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <PredictionMiniCard
                  item={m.curated}
                  onOpen={() => setOpenId(m.curated.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredOnQuarter.length === 0 && (
          <div
            className="rounded-[16px] p-8 text-center text-[13px]"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(240,240,245,0.5)",
            }}
          >
            По выбранным фильтрам ничего не найдено
          </div>
        )}
      </div>

      {/* Footnote */}
      <p className="mt-10 text-[12px] leading-[1.6] text-text-tertiary max-w-3xl">
        Все прогнозы основаны на исследованиях «Тихая замена» (март 2026) и «ИИ в
        2025 и прогнозы на 2026» (январь 2026). Уровень уверенности отражает сочетание
        данных, моделирования и экспертной оценки.
      </p>

      {/* Modal */}
      <AnimatePresence>
        {openItem && (
          <DetailModal
            curated={openItem.curated}
            full={openItem.full}
            onClose={() => setOpenId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ============================================================================
// Timeline — горизонтальная шкала
// ============================================================================

function Timeline({
  counts,
  activeIdx,
  onSelect,
  getItemsAt,
  onOpen,
}: {
  counts: number[];
  activeIdx: number | null;
  onSelect: (i: number) => void;
  getItemsAt: (i: number) => Array<{ curated: CuratedItem; full: Prediction }>;
  onOpen: (id: string) => void;
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Клавиатурная навигация по точкам
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onSelect(Math.min(QUARTERS.length - 1, activeIdx + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onSelect(Math.max(0, activeIdx - 1));
      } else if (e.key === "Escape") {
        onSelect(activeIdx); // toggle off
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, onSelect]);

  const popoverIdx = activeIdx ?? hoverIdx;

  return (
    <div className="mt-12">
      {/* Шкала — editorial / Swiss style */}
      <div
        ref={trackRef}
        className="relative pt-16 pb-20 select-none"
      >
        {/* Годовые маркеры — крупные служебные подписи */}
        <div className="absolute inset-x-0 top-0 flex justify-between pointer-events-none">
          {[2026, 2027, 2028].map((year, i) => (
            <div
              key={year}
              className="absolute text-[11px] uppercase tracking-[0.22em] font-mono text-text-tertiary"
              style={{
                left: `${(i * 4 + 1.5) / (QUARTERS.length - 1) * 100}%`,
                transform: "translateX(-50%)",
                top: 0,
              }}
            >
              {year}
            </div>
          ))}
        </div>

        {/* Основная горизонтальная линия — тонкая */}
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/15"
        />

        {/* Тики между кварталами (короткие штрихи вверх/вниз) */}
        {QUARTERS.map((_, i) => {
          const left = (i / (QUARTERS.length - 1)) * 100;
          const isYearStart = i % 4 === 0;
          return (
            <div
              key={`tick-${i}`}
              className="absolute top-1/2 w-px bg-white/15 pointer-events-none"
              style={{
                left: `${left}%`,
                height: isYearStart ? 14 : 6,
                transform: "translate(-0.5px, -50%)",
                opacity: isYearStart ? 0.4 : 0.2,
              }}
            />
          );
        })}

        {/* Кризисные зоны — тонкие, editorial */}
        {CRISIS_RANGES.map(([a, b], i) => {
          const left = (a / (QUARTERS.length - 1)) * 100;
          const width = ((b - a) / (QUARTERS.length - 1)) * 100;
          return (
            <div key={i} aria-hidden className="pointer-events-none">
              {/* Diagonal-stripe полоса под линией */}
              <div
                className="absolute top-1/2 h-[3px]"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  background: CRISIS_RED,
                  transform: "translateY(-50%)",
                  opacity: 0.85,
                }}
              />
              {/* Скобка-индикатор сверху */}
              <div
                className="absolute"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  top: "calc(50% - 36px)",
                }}
              >
                <div className="relative h-3">
                  <div
                    className="absolute left-0 top-0 w-px h-full"
                    style={{ background: CRISIS_RED }}
                  />
                  <div
                    className="absolute right-0 top-0 w-px h-full"
                    style={{ background: CRISIS_RED }}
                  />
                  <div
                    className="absolute left-0 right-0 bottom-0 h-px"
                    style={{ background: CRISIS_RED }}
                  />
                </div>
                <div
                  className="text-[9px] uppercase tracking-[0.22em] font-mono text-center mt-1"
                  style={{ color: "#FCA5A5" }}
                >
                  Crisis window
                </div>
              </div>
            </div>
          );
        })}

        {/* Точки */}
        <div className="relative flex items-center justify-between h-10">
          {QUARTERS.map((q, i) => {
            const isActive = activeIdx === i;
            const isHover = hoverIdx === i;
            const count = counts[i];
            const has = count > 0;

            return (
              <button
                key={q}
                type="button"
                onClick={() => onSelect(i)}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                onFocus={() => setHoverIdx(i)}
                onBlur={() => setHoverIdx(null)}
                className="relative flex flex-col items-center justify-center group focus:outline-none"
                style={{ width: 32, height: 32 }}
                aria-label={`${q}: ${count} прогноз(ов)`}
              >
                {/* Точка — концентрические круги, editorial */}
                <span className="relative flex items-center justify-center">
                  {/* Внешнее кольцо при active/hover */}
                  <motion.span
                    className="absolute rounded-full border"
                    animate={{
                      width: isActive ? 22 : isHover && has ? 18 : 0,
                      height: isActive ? 22 : isHover && has ? 18 : 0,
                      opacity: isActive || (isHover && has) ? 1 : 0,
                      borderColor: "rgba(255,255,255,0.5)",
                    }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {/* Сама точка */}
                  <motion.span
                    className="rounded-full"
                    animate={{
                      width: has ? (isActive ? 8 : 6) : 4,
                      height: has ? (isActive ? 8 : 6) : 4,
                      backgroundColor: has
                        ? isActive
                          ? "#ffffff"
                          : "rgba(255,255,255,0.85)"
                        : "rgba(255,255,255,0.25)",
                    }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>

                {/* Подпись квартала под точкой — mono */}
                <span
                  className="absolute top-full mt-4 text-[10px] tabular-nums whitespace-nowrap font-mono uppercase tracking-[0.1em] transition-colors"
                  style={{
                    color: isActive
                      ? "#fff"
                      : isHover && has
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(240,240,245,0.35)",
                  }}
                >
                  {q.split(" ")[0]}
                </span>

                {/* Счётчик над точкой */}
                {has && (
                  <span
                    className="absolute bottom-full mb-3 text-[10px] font-medium tabular-nums font-mono"
                    style={{
                      color: isActive
                        ? "#fff"
                        : "rgba(255,255,255,0.55)",
                    }}
                  >
                    {String(count).padStart(2, "0")}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Поповер */}
        <AnimatePresence>
          {popoverIdx !== null && counts[popoverIdx] > 0 && (
            <TimelinePopover
              idx={popoverIdx}
              items={getItemsAt(popoverIdx)}
              onOpen={onOpen}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Минималистичная подсказка */}
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-text-tertiary font-mono mt-2">
        <span>← наведите или кликните на точку</span>
        <span>{QUARTERS.length} кварталов</span>
      </div>
    </div>
  );
}


// ============================================================================
// Поповер над активной/наведённой точкой
// ============================================================================

function TimelinePopover({
  idx,
  items,
  onOpen,
}: {
  idx: number;
  items: Array<{ curated: CuratedItem; full: Prediction }>;
  onOpen: (id: string) => void;
}) {
  const leftPct = (idx / (QUARTERS.length - 1)) * 100;
  // Прижимаем к краю, чтобы не вылетал
  const align =
    idx <= 1 ? "left-0 translate-x-0" : idx >= QUARTERS.length - 2 ? "right-0 left-auto translate-x-0" : "-translate-x-1/2";
  const positionStyle: React.CSSProperties =
    idx <= 1
      ? { left: 0 }
      : idx >= QUARTERS.length - 2
        ? { right: 0 }
        : { left: `calc(${leftPct}% + 8px)` };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18 }}
      className={`absolute z-20 top-[calc(50%+44px)] ${align} w-[min(360px,calc(100vw-48px))]`}
      style={positionStyle}
    >
      <div
        className="p-5"
        style={{
          background: "#0a0a0f",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.8)",
        }}
      >
        <div className="flex items-baseline justify-between mb-3 pb-3 border-b border-white/10">
          <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-white">
            {QUARTERS[idx]}
          </div>
          <div className="text-[10px] tabular-nums font-mono text-text-tertiary">
            {String(items.length).padStart(2, "0")} {items.length === 1 ? "прогноз" : "прогнозов"}
          </div>
        </div>
        <ul className="space-y-3">
          {items.slice(0, 3).map((m, i) => (
            <li key={m.curated.id} className="flex items-start gap-3">
              <span className="text-[10px] tabular-nums text-text-tertiary font-mono mt-[3px] shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <button
                onClick={() => onOpen(m.curated.id)}
                className="text-left flex-1 text-[13px] leading-[1.4] text-text-secondary hover:text-white transition-colors"
              >
                {m.curated.shortTitle}
              </button>
            </li>
          ))}
          {items.length > 3 && (
            <li className="text-[10px] uppercase tracking-[0.12em] text-text-tertiary font-mono pl-7">
              +{items.length - 3} ещё
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Карточка прогноза
// ============================================================================

function PredictionMiniCard({
  item,
  onOpen,
}: {
  item: CuratedItem;
  onOpen: () => void;
}) {
  const cColor = confidenceColor(item.confidence);
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onOpen}
      className="group relative h-full min-h-[260px] p-6 flex flex-col cursor-pointer transition-colors duration-300"
      style={{
        background: hover ? "#101015" : "#0a0a0f",
      }}
    >
      {/* Confidence bar — тонкая полоса сверху */}
      <div
        className="absolute top-0 left-0 h-px transition-all duration-500"
        style={{
          width: hover ? "100%" : `${item.confidence}%`,
          background: cColor,
        }}
      />

      {/* Метаданные — mono, разнесены по углам */}
      <div className="flex items-baseline justify-between text-[10px] font-mono uppercase tracking-[0.14em]">
        <span className="text-text-tertiary">{item.horizon}</span>
        <span className="tabular-nums text-text-secondary">
          {item.confidence}<span className="text-text-tertiary">/100</span>
        </span>
      </div>

      {/* Заголовок — крупная типографика */}
      <h3 className="mt-6 text-[18px] font-medium leading-[1.2] tracking-[-0.015em] text-text-primary text-balance">
        {item.shortTitle}
      </h3>

      {/* Описание */}
      <p className="mt-3 text-[13px] text-text-secondary leading-[1.6] flex-1">
        {item.shortDescription}
      </p>

      {/* Footer — источник + arrow */}
      <div className="mt-6 pt-5 border-t border-white/8 flex items-center justify-between gap-3">
        <span className="text-[10px] uppercase tracking-[0.12em] font-mono text-text-tertiary truncate">
          {item.sourceLabel}
        </span>
        <span
          className="text-[18px] leading-none text-text-tertiary transition-all duration-300 group-hover:text-white group-hover:translate-x-1"
          aria-hidden
        >
          →
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Модалка с полным текстом прогноза
// ============================================================================

function DetailModal({
  curated,
  full,
  onClose,
}: {
  curated: CuratedItem;
  full: Prediction;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const cColor = confidenceColor(curated.confidence);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[720px] max-h-[88vh] overflow-y-auto rounded-[20px] p-6 md:p-8"
        style={{
          background: "linear-gradient(180deg, rgba(20,22,28,0.98), rgba(12,14,18,0.98))",
          border: `1px solid ${EMERALD}22`,
          boxShadow: `0 40px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(240,240,245,0.7)",
          }}
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.14em]">
          <span style={{ color: BLUE }}>{curated.horizon}</span>
          <span className="text-text-tertiary">·</span>
          <span style={{ color: cColor }}>
            Уверенность: {curated.confidence}% — {confidenceLabel(curated.confidence)}
          </span>
        </div>

        <h3
          id="modal-title"
          className="mt-3 text-[22px] md:text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] text-text-primary"
        >
          {full.title}
        </h3>

        <p className="mt-5 text-[15px] text-text-secondary leading-[1.65]">
          {full.statement}
        </p>

        {full.evidence.length > 0 && (
          <div className="mt-6">
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary mb-3">
              Свидетельства
            </div>
            <ul className="space-y-2.5">
              {full.evidence.map((ev, i) => (
                <li
                  key={i}
                  className="rounded-[10px] p-3 text-[13px] text-text-secondary leading-[1.55]"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="text-[11px] text-text-tertiary mb-1">
                    {ev.date}
                  </div>
                  {ev.note}
                  {ev.source_url && (
                    <a
                      href={ev.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 inline-flex items-center gap-1 text-[12px]"
                      style={{ color: BLUE }}
                    >
                      Источник <ExternalLink size={11} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {full.notes && (
          <p className="mt-5 text-[13px] italic text-text-tertiary leading-[1.6]">
            {full.notes}
          </p>
        )}

        <div className="mt-7 pt-5 border-t border-white/5 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-[12px] text-text-tertiary">
            Источник: {curated.sourceLabel}
          </div>
          {curated.pdfUrl && (
            <a
              href={curated.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] transition-all"
              style={{
                background: `linear-gradient(135deg, ${EMERALD}22, ${BLUE}22)`,
                border: `1px solid ${EMERALD}55`,
                color: "#fff",
                boxShadow: `0 8px 24px -12px ${EMERALD}66`,
              }}
            >
              <FileText size={14} /> Открыть PDF исследования
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}