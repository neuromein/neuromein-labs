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
      className="mt-6 rounded-[28px] p-6 md:p-10 lg:p-12"
      style={{
        background: "linear-gradient(180deg, rgba(15,17,21,0.85) 0%, rgba(8,8,13,0.85) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        boxShadow:
          "0 24px 60px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Заголовок */}
      <header className="max-w-3xl">
        <div
          className="text-[11px] uppercase tracking-[0.18em] mb-3"
          style={{ color: EMERALD }}
        >
          Интерактивная шкала
        </div>
        <h2
          id="timeline-heading"
          className="text-[28px] md:text-[36px] lg:text-[44px] font-semibold leading-[1.1] tracking-[-0.02em] text-text-primary"
        >
          Прогнозы 2026–2028 и их проверка
        </h2>
        <p className="mt-4 text-[15px] md:text-[16px] text-text-secondary leading-[1.6]">
          Интерактивная шкала на основе исследований «Тихая замена» и «ИИ в 2025».
        </p>
      </header>

      {/* Фильтры */}
      <div className="mt-8 flex flex-wrap gap-2">
        {(Object.keys(THEME_LABELS) as ThemeKey[]).map((k) => {
          const isActive = theme === k;
          return (
            <button
              key={k}
              onClick={() => setTheme(k)}
              className="px-4 py-2 rounded-full text-[13px] transition-all duration-200 whitespace-nowrap border"
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${EMERALD}22, ${BLUE}22)`,
                      borderColor: `${EMERALD}66`,
                      color: "#fff",
                      boxShadow: `0 0 0 1px ${EMERALD}33, 0 8px 24px -12px ${EMERALD}55`,
                    }
                  : {
                      background: "rgba(255,255,255,0.02)",
                      borderColor: "rgba(255,255,255,0.08)",
                      color: "rgba(240,240,245,0.65)",
                    }
              }
            >
              {THEME_LABELS[k]}
            </button>
          );
        })}
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
      <div className="mt-12">
        <div className="flex items-end justify-between mb-5 gap-4 flex-wrap">
          <div className="text-[12px] uppercase tracking-[0.12em] text-text-tertiary">
            {activeQuarterIdx !== null
              ? `Прогнозы на ${QUARTERS[activeQuarterIdx]}`
              : `Прогнозы (${filtered.length})`}
          </div>
          {activeQuarterIdx !== null && (
            <button
              onClick={() => setActiveQuarterIdx(null)}
              className="text-[12px] text-text-tertiary hover:text-text-primary transition-colors inline-flex items-center gap-1"
            >
              <X size={12} /> Сбросить квартал
            </button>
          )}
        </div>

        <motion.div
          layout
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
    <div className="mt-10">
      {/* Легенда */}
      <div className="flex items-center gap-5 mb-6 text-[11px] text-text-tertiary flex-wrap">
        <LegendDot color={EMERALD} label="Уверенность ≥ 75%" />
        <LegendDot color="#F59E0B" label="55–74%" />
        <LegendDot color="#EF4444" label="< 55%" />
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block w-6 h-1.5 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${CRISIS_RED}00, ${CRISIS_RED}cc, ${CRISIS_RED}00)`,
            }}
          />
          Зоны пиковых кризисов
        </span>
      </div>

      <div
        ref={trackRef}
        className="relative pt-12 pb-16 px-2 select-none"
      >
        {/* Базовая линия */}
        <div
          className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-[2px] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.04))",
          }}
        />

        {/* Кризисные зоны */}
        {CRISIS_RANGES.map(([a, b], i) => {
          const left = (a / (QUARTERS.length - 1)) * 100;
          const width = ((b - a) / (QUARTERS.length - 1)) * 100;
          return (
            <div key={i} aria-hidden>
              {/* Внешнее насыщенное свечение */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-20 rounded-full pointer-events-none"
                style={{
                  left: `calc(${left}% + 8px)`,
                  width: `calc(${width}%)`,
                  background: `radial-gradient(ellipse at center, #DC262655 0%, #B91C1C33 35%, transparent 75%)`,
                  filter: "blur(12px)",
                }}
              />
              {/* Чёткая полоса */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-9 rounded-full pointer-events-none"
                style={{
                  left: `calc(${left}% + 8px)`,
                  width: `calc(${width}%)`,
                  background: `linear-gradient(90deg, transparent 0%, #DC262633 15%, #EF444466 50%, #DC262633 85%, transparent 100%)`,
                  border: `1px solid #DC262633`,
                  boxShadow: `inset 0 0 24px #B91C1C44`,
                }}
              />
              {/* Метка */}
              <div
                className="absolute pointer-events-none text-[9px] uppercase tracking-[0.18em] font-medium whitespace-nowrap"
                style={{
                  left: `calc(${left + width / 2}% + 8px)`,
                  transform: "translate(-50%, 0)",
                  top: "calc(50% - 38px)",
                  color: "#FCA5A5",
                  textShadow: "0 0 12px #DC262688",
                }}
              >
                Зона кризиса
              </div>
            </div>
          );
        })}

        {/* Точки */}
        <div className="relative flex items-center justify-between h-8">
          {QUARTERS.map((q, i) => {
            const isActive = activeIdx === i;
            const isHover = hoverIdx === i;
            const crisis = isCrisisIndex(i);
            const count = counts[i];
            const has = count > 0;
            const dotColor = isActive
              ? EMERALD
              : has
                ? BLUE
                : "rgba(255,255,255,0.2)";
            const size = isActive ? 18 : isHover && has ? 16 : has ? 13 : 7;

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
                style={{ width: 28, height: 28 }}
                aria-label={`${q}: ${count} прогноз(ов)`}
              >
                {/* Pulse при hover/active */}
                {(isActive || (isHover && has)) && (
                  <motion.span
                    className="absolute rounded-full pointer-events-none"
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: 0, scale: 2.4 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                    style={{
                      width: size,
                      height: size,
                      background: dotColor,
                    }}
                  />
                )}
                <motion.span
                  layout
                  className="rounded-full relative"
                  animate={{
                    width: size,
                    height: size,
                    backgroundColor: dotColor,
                    boxShadow: isActive || isHover
                      ? `0 0 0 5px ${dotColor}22, 0 0 0 1px ${dotColor}, 0 0 24px ${dotColor}cc`
                      : has
                        ? `0 0 0 1px ${dotColor}88, 0 0 12px ${dotColor}55`
                        : "none",
                  }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Подпись квартала */}
                <span
                  className="absolute top-full mt-3 text-[10px] tabular-nums whitespace-nowrap transition-colors"
                  style={{
                    color: isActive
                      ? "#fff"
                      : crisis
                        ? "#FCA5A5"
                        : "rgba(240,240,245,0.45)",
                  }}
                >
                  {q}
                </span>
                {/* Счётчик */}
                {has && (
                  <span
                    className="absolute -top-5 text-[10px] font-medium tabular-nums"
                    style={{ color: isActive ? EMERALD : "rgba(255,255,255,0.5)" }}
                  >
                    {count}
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

      {/* Слайдер */}
      <div className="mt-2 px-2">
        <input
          type="range"
          min={0}
          max={QUARTERS.length - 1}
          step={1}
          value={activeIdx ?? 0}
          onChange={(e) => onSelect(Number(e.target.value))}
          aria-label="Перетащите ползунок по шкале кварталов"
          className="timeline-range w-full"
          style={
            {
              "--track-fill": EMERALD,
            } as React.CSSProperties
          }
        />
        <style>{`
          .timeline-range {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            height: 24px;
          }
          .timeline-range::-webkit-slider-runnable-track {
            height: 2px;
            background: rgba(255,255,255,0.08);
            border-radius: 2px;
          }
          .timeline-range::-moz-range-track {
            height: 2px;
            background: rgba(255,255,255,0.08);
            border-radius: 2px;
          }
          .timeline-range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 999px;
            background: ${EMERALD};
            margin-top: -6px;
            box-shadow: 0 0 0 4px ${EMERALD}22, 0 0 12px ${EMERALD}88;
            cursor: pointer;
            border: none;
          }
          .timeline-range::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border-radius: 999px;
            background: ${EMERALD};
            box-shadow: 0 0 0 4px ${EMERALD}22, 0 0 12px ${EMERALD}88;
            cursor: pointer;
            border: none;
          }
          .timeline-range:focus { outline: none; }
        `}</style>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}88` }}
      />
      {label}
    </span>
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
      className={`absolute z-20 top-[calc(50%+28px)] ${align} w-[min(360px,calc(100vw-48px))]`}
      style={positionStyle}
    >
      <div
        className="rounded-[14px] p-4"
        style={{
          background: "rgba(15,17,21,0.95)",
          border: `1px solid ${EMERALD}33`,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: `0 20px 50px -20px rgba(0,0,0,0.7), 0 0 0 1px ${EMERALD}11`,
        }}
      >
        <div
          className="text-[10px] uppercase tracking-[0.14em] mb-2"
          style={{ color: EMERALD }}
        >
          {QUARTERS[idx]} · {items.length}{" "}
          {items.length === 1 ? "прогноз" : "прогнозов"}
        </div>
        <ul className="space-y-2">
          {items.slice(0, 3).map((m) => (
            <li key={m.curated.id}>
              <button
                onClick={() => onOpen(m.curated.id)}
                className="text-left w-full text-[13px] leading-[1.4] text-text-primary hover:text-white transition-colors"
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
                  style={{
                    background: confidenceColor(m.curated.confidence),
                    boxShadow: `0 0 6px ${confidenceColor(m.curated.confidence)}88`,
                  }}
                />
                {m.curated.shortTitle}
              </button>
            </li>
          ))}
          {items.length > 3 && (
            <li className="text-[11px] text-text-tertiary pl-3.5">
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
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="h-full rounded-[16px] p-5 flex flex-col"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em]">
        <span style={{ color: BLUE }}>{item.horizon}</span>
        <span
          className="inline-flex items-center gap-1.5"
          style={{ color: cColor }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: cColor, boxShadow: `0 0 6px ${cColor}88` }}
          />
          {item.confidence}%
        </span>
      </div>
      <h3 className="mt-3 text-[15px] font-medium leading-[1.35] tracking-[-0.01em] text-text-primary">
        {item.shortTitle}
      </h3>
      <p className="mt-2 text-[13px] text-text-secondary leading-[1.55] flex-1">
        {item.shortDescription}
      </p>
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
        <span className="text-[11px] text-text-tertiary truncate">
          {item.sourceLabel}
        </span>
        <button
          onClick={onOpen}
          className="text-[12px] inline-flex items-center gap-1 transition-colors"
          style={{ color: EMERALD }}
        >
          Подробнее →
        </button>
      </div>
    </motion.div>
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