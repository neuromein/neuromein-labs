import { useMemo, useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, FileText, ArrowUpRight } from "lucide-react";
import {
  type Prediction,
  type CategoryKey,
} from "@/data/predictions";

// ============================================================================
// Палитра — Indigo → Cyan градиент (Linear / Arc style)
// ============================================================================

const INDIGO = "#6366F1";
const CYAN = "#22D3EE";
const ROSE = "#F43F5E"; // для зон кризисов (мягкий, не кричащий)
const GRADIENT = "linear-gradient(135deg, #6366F1 0%, #22D3EE 100%)";

// ============================================================================
// Тематические группы
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
// Курируемая выборка
// ============================================================================

type Quarter = `Q${1 | 2 | 3 | 4} ${2026 | 2027 | 2028}`;

interface CuratedItem {
  id: string;
  shortTitle: string;
  shortDescription: string;
  horizon: string;
  confidence: number;
  sourceLabel: string;
  pdfUrl?: string;
  researchSlug?: string;
  quarter: Quarter;
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
    sourceLabel: "ИИ в 2025 и прогнозы на 2026, гл. 2.1",
    pdfUrl: PDF_AI2025,
    researchSlug: "ai-2025-forecast",
    quarter: "Q1 2026",
  },
  {
    id: "pred-003",
    shortTitle: "Конец SaaS: Agent-as-a-Service",
    shortDescription:
      "Вендоры начнут продавать единицы готового труда — оплата за результат, а не за лицензию.",
    horizon: "Конец 2026",
    confidence: 70,
    sourceLabel: "ИИ в 2025 и прогнозы на 2026, гл. 2.2",
    pdfUrl: PDF_AI2025,
    researchSlug: "ai-2025-forecast",
    quarter: "Q4 2026",
  },
  {
    id: "pred-007",
    shortTitle: "«Ловушка джуниора»",
    shortDescription:
      "ИИ заменяет задачи, через которые молодые специалисты входили в профессию — цепочка опыта рвётся.",
    horizon: "В течение 2026",
    confidence: 85,
    sourceLabel: "ИИ в 2025 и прогнозы на 2026, гл. 2.3",
    pdfUrl: PDF_AI2025,
    researchSlug: "ai-2025-forecast",
    quarter: "Q2 2026",
  },
  {
    id: "pred-008",
    shortTitle: "Цифровые двойники и элитизация живого",
    shortDescription:
      "Аватары проходят тест Тьюринга в видео; живое общение становится премиальным сервисом.",
    horizon: "В течение 2026",
    confidence: 65,
    sourceLabel: "ИИ в 2025 и прогнозы на 2026, гл. 2.3",
    pdfUrl: PDF_AI2025,
    researchSlug: "ai-2025-forecast",
    quarter: "Q3 2026",
  },
  {
    id: "pred-013",
    shortTitle: "Год «физического ИИ»",
    shortDescription:
      "Облачно-бортовая архитектура VLA, 5-й уровень автономности, заводы Tesla и BMW как полигоны.",
    horizon: "Конец 2026",
    confidence: 70,
    sourceLabel: "ИИ в 2025 и прогнозы на 2026, гл. 2.4",
    pdfUrl: PDF_AI2025,
    researchSlug: "ai-2025-forecast",
    quarter: "Q4 2026",
  },
  {
    id: "pred-014",
    shortTitle: "Войны дронов как доминирующий формат",
    shortDescription:
      "Беспилотные системы достигают операционной зрелости; первые удары по гиперскейл-облакам.",
    horizon: "В течение 2026",
    confidence: 75,
    sourceLabel: "ИИ в 2025 и прогнозы на 2026, гл. 2.4",
    pdfUrl: PDF_AI2025,
    researchSlug: "ai-2025-forecast",
    quarter: "Q2 2026",
  },
  {
    id: "pred-015",
    shortTitle: "Закат SEO, рассвет GEO",
    shortDescription:
      "Бренды переходят от топа выдачи к интеграции в прямой ответ ИИ; дизайн сайтов — под машины.",
    horizon: "Конец 2026",
    confidence: 80,
    sourceLabel: "ИИ в 2025 и прогнозы на 2026, гл. 2.5",
    pdfUrl: PDF_AI2025,
    researchSlug: "ai-2025-forecast",
    quarter: "Q3 2026",
  },
  {
    id: "pred-010",
    shortTitle: "«Ножницы навыков»",
    shortDescription:
      "Обязательное владение ИИ + входное тестирование на безалгоритмическое мышление.",
    horizon: "К 2027",
    confidence: 65,
    sourceLabel: "ИИ в 2025 и прогнозы на 2026, гл. 2.3",
    pdfUrl: PDF_AI2025,
    researchSlug: "ai-2025-forecast",
    quarter: "Q1 2027",
  },
  {
    id: "pred-027",
    shortTitle: "Каскад кризисов 2026–2027",
    shortDescription:
      "Tech-коррекция, геополитическое обострение и рецессия — реальность опередила график.",
    horizon: "Q2 2026 — середина 2027",
    confidence: 90,
    sourceLabel: "Тихая замена, гл. 6.3",
    pdfUrl: PDF_SILENT,
    researchSlug: "silent-replacement",
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
    researchSlug: "silent-replacement",
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
    researchSlug: "silent-replacement",
    quarter: "Q4 2026",
  },
  {
    id: "pred-032",
    shortTitle: "Рынок труда — «гантель»",
    shortDescription:
      "Сверху — операторы ИИ, снизу — нестандартный физический труд, в середине — пустота.",
    horizon: "До 2028",
    confidence: 75,
    sourceLabel: "Тихая замена, гл. 7.4",
    pdfUrl: PDF_SILENT,
    researchSlug: "silent-replacement",
    quarter: "Q4 2027",
  },
  {
    id: "pred-033",
    shortTitle: "Гуманоиды дешевле зарплаты складского рабочего",
    shortDescription:
      "Tesla, Figure, Boston Dynamics, Unitree давят на нижнюю перекладину «гантели».",
    horizon: "2028+",
    confidence: 60,
    sourceLabel: "Тихая замена, гл. 7.4",
    pdfUrl: PDF_SILENT,
    researchSlug: "silent-replacement",
    quarter: "Q2 2028",
  },
  {
    id: "pred-034",
    shortTitle: "Эффект односторонней двери",
    shortDescription:
      "Сокращённых в кризис не вернут — позиции займут ИИ-сотрудники до восстановления экономики.",
    horizon: "2027–2029",
    confidence: 80,
    sourceLabel: "Тихая замена, гл. 3.4, 6.3",
    pdfUrl: PDF_SILENT,
    researchSlug: "silent-replacement",
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
    researchSlug: "silent-replacement",
    quarter: "Q1 2028",
  },
];

// ============================================================================
// Шкала кварталов
// ============================================================================

const QUARTERS: Quarter[] = [
  "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026",
  "Q1 2027", "Q2 2027", "Q3 2027", "Q4 2027",
  "Q1 2028", "Q2 2028", "Q3 2028", "Q4 2028",
];

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

function confidenceLabel(c: number): string {
  if (c >= 75) return "Высокая";
  if (c >= 55) return "Средняя";
  return "Спекулятивная";
}

// ============================================================================
// Главный компонент
// ============================================================================

export function PredictionsTimeline({ predictions }: { predictions: Prediction[] }) {
  const [theme, setTheme] = useState<ThemeKey>("all");
  const [activeQuarterIdx, setActiveQuarterIdx] = useState<number | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const merged = useMemo(() => {
    const byId = new Map(predictions.map((p) => [p.id, p]));
    return CURATED
      .map((c) => {
        const full = byId.get(c.id);
        if (!full) return null;
        return { curated: c, full, themes: predictionThemes(full) };
      })
      .filter((x): x is { curated: CuratedItem; full: Prediction; themes: ThemeKey[] } => !!x);
  }, [predictions]);

  const filtered = useMemo(
    () => merged.filter((m) => theme === "all" || m.themes.includes(theme)),
    [merged, theme],
  );

  const filteredOnQuarter = useMemo(() => {
    if (activeQuarterIdx === null) return filtered;
    const q = QUARTERS[activeQuarterIdx];
    return filtered.filter((m) => m.curated.quarter === q);
  }, [filtered, activeQuarterIdx]);

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
    <section aria-labelledby="timeline-heading" className="mt-4">
      {/* Заголовок */}
      <header className="max-w-4xl pt-4 sm:pt-8">
        <h2
          id="timeline-heading"
          className="text-[30px] sm:text-[40px] md:text-[52px] lg:text-[64px] font-medium leading-[1.02] sm:leading-[0.98] tracking-[-0.035em] text-text-primary text-balance"
        >
          Прогнозы 2026–2028 <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: GRADIENT }}
          >
            и их проверка
          </span>
        </h2>
        <p className="mt-5 sm:mt-6 text-[14.5px] sm:text-[15px] md:text-[17px] text-text-secondary leading-[1.55] max-w-[640px]">
          Шкала на основе исследований «Тихая замена» и «ИИ в 2025». Каждый прогноз
          привязан к кварталу и сопровождается уровнем уверенности.
        </p>
      </header>

      {/* Фильтры — pill-кнопки в стиле Apple */}
      <div className="mt-8 sm:mt-12 flex flex-wrap gap-2">
        {(Object.keys(THEME_LABELS) as ThemeKey[]).map((k) => {
          const isActive = theme === k;
          return (
            <button
              key={k}
              onClick={() => setTheme(k)}
              className="relative px-5 py-2.5 rounded-full text-[13px] font-medium transition-colors duration-200 whitespace-nowrap"
              style={{
                color: isActive ? "#fff" : "rgba(240,240,245,0.6)",
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="filter-bg"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: GRADIENT,
                    boxShadow:
                      "0 8px 24px -8px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              {!isActive && (
                <span
                  className="absolute inset-0 rounded-full border border-white/8 hover:border-white/15 transition-colors"
                  aria-hidden
                />
              )}
              <span className="relative z-10">{THEME_LABELS[k]}</span>
            </button>
          );
        })}
      </div>

      {/* Arc Timeline */}
      <ArcTimeline
        counts={quarterCounts}
        activeIdx={activeQuarterIdx}
        onSelect={(i) => setActiveQuarterIdx((cur) => (cur === i ? null : i))}
        getItemsAt={(i) =>
          filtered.filter((m) => quarterIndex(m.curated.quarter) === i)
        }
        onOpen={(id) => setOpenId(id)}
      />

      {/* Сетка карточек */}
      <div className="mt-16">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-baseline gap-3">
            <h3 className="text-[20px] font-medium text-text-primary tracking-[-0.01em]">
              {activeQuarterIdx !== null
                ? `Прогнозы на ${QUARTERS[activeQuarterIdx]}`
                : "Все прогнозы"}
            </h3>
            <span className="text-[13px] tabular-nums text-text-tertiary">
              {activeQuarterIdx === null && theme === "all"
                ? predictions.length
                : filteredOnQuarter.length}
            </span>
          </div>
          {activeQuarterIdx !== null && (
            <button
              onClick={() => setActiveQuarterIdx(null)}
              className="text-[13px] text-text-tertiary hover:text-text-primary transition-colors inline-flex items-center gap-1.5"
            >
              <X size={13} /> Сбросить квартал
            </button>
          )}
        </div>

        <motion.div
          layout
          className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredOnQuarter.map((m) => (
              <motion.div
                key={m.curated.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlassCard
                  item={m.curated}
                  onOpen={() => setOpenId(m.curated.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredOnQuarter.length === 0 && (
          <div
            className="rounded-[24px] p-10 text-center text-[14px] text-text-tertiary"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            По выбранным фильтрам ничего не найдено
          </div>
        )}
      </div>

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
// Arc Timeline — Linear / Arc style
// ============================================================================

function ArcTimeline({
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
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(900);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setWidth(e.contentRect.width);
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  // Клавиатура
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
        onSelect(activeIdx);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, onSelect]);

  // Закрытие попровера по клику вне него
  useEffect(() => {
    if (activeIdx === null) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      // Игнорируем клики внутри попровера
      if (popoverRef.current && popoverRef.current.contains(target)) return;
      // Игнорируем клики по точкам (SVG g внутри wrapperRef обрабатывает onSelect)
      if (
        target instanceof Element &&
        target.closest("[data-arc-dot]")
      ) return;
      onSelect(activeIdx);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [activeIdx, onSelect]);

  const popoverIdx = activeIdx ?? hoverIdx;

  const isMobile = width > 0 && width < 560;

  // ---- Геометрия дуги ----
  const PADDING_X = 90;
  const W = Math.max(width, 360);
  const arcWidth = W - PADDING_X * 2;
  const ARC_HEIGHT = Math.min(112, arcWidth * 0.125);
  const radius = (Math.pow(arcWidth / 2, 2) + Math.pow(ARC_HEIGHT, 2)) / (2 * ARC_HEIGHT);
  const cx = W / 2;
  const TOP_SAFE_SPACE = 68;
  const BOTTOM_SAFE_SPACE = 58;
  const cy = TOP_SAFE_SPACE + radius;
  const totalH = TOP_SAFE_SPACE + ARC_HEIGHT + BOTTOM_SAFE_SPACE;

  const startAngle = Math.atan2(-(radius - ARC_HEIGHT), -arcWidth / 2);
  const endAngle = Math.atan2(-(radius - ARC_HEIGHT), arcWidth / 2);

  function pointAt(t: number): { x: number; y: number; angle: number } {
    const angle = startAngle + (endAngle - startAngle) * t;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      angle,
    };
  }

  const dots = QUARTERS.map((_, i) => {
    const t = i / (QUARTERS.length - 1);
    return pointAt(t);
  });

  // SVG path для дуги
  const startPt = pointAt(0);
  const endPt = pointAt(1);
  const arcPath = `M ${startPt.x} ${startPt.y} A ${radius} ${radius} 0 0 1 ${endPt.x} ${endPt.y}`;

  // Сегменты для кризисных зон
  const crisisSegments = CRISIS_RANGES.map(([a, b]) => {
    const tA = a / (QUARTERS.length - 1);
    const tB = b / (QUARTERS.length - 1);
    const pA = pointAt(tA);
    const pB = pointAt(tB);
    return `M ${pA.x} ${pA.y} A ${radius} ${radius} 0 0 1 ${pB.x} ${pB.y}`;
  });

  return (
    <div className="mt-10 md:mt-14">
      {/* Контейнер-стекло */}
      <div
        ref={wrapperRef}
        className="relative rounded-[24px] sm:rounded-[28px] px-3 sm:px-4 md:px-8 pt-4 sm:pt-5 pb-5 sm:pb-6"
        style={{
          background:
            "linear-gradient(180deg, rgba(28,28,36,0.55) 0%, rgba(14,14,20,0.55) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          boxShadow:
            "0 30px 80px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
        onClick={(e) => {
          // Клик по пустому пространству контейнера закрывает попровер
          if (e.target === e.currentTarget && activeIdx !== null) {
            onSelect(activeIdx);
          }
        }}
      >
        {/* Подсказка сверху по центру */}
        <div className="text-[12px] text-text-tertiary text-center mb-2">
          {isMobile ? "Нажмите на квартал" : "Наведите или кликните на точку"}
        </div>

        {/* Подсветка-aurora за дугой */}
        <div
          aria-hidden
          className="absolute pointer-events-none rounded-[28px]"
          style={{
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 400,
            background:
              "radial-gradient(ellipse at center, rgba(99,102,241,0.18) 0%, rgba(34,211,238,0.10) 35%, transparent 70%)",
            filter: "blur(40px)",
            overflow: "hidden",
          }}
        />

        {/* Мобильный список кварталов */}
        {isMobile ? (
          <MobileQuarterList
            counts={counts}
            activeIdx={activeIdx}
            onSelect={onSelect}
            getItemsAt={getItemsAt}
            onOpen={onOpen}
          />
        ) : (
          <ArcSvg
            W={W}
            totalH={totalH}
            arcPath={arcPath}
            crisisSegments={crisisSegments}
            dots={dots}
            counts={counts}
            activeIdx={activeIdx}
            hoverIdx={hoverIdx}
            popoverIdx={popoverIdx}
            popoverRef={popoverRef}
            getItemsAt={getItemsAt}
            onOpen={onOpen}
            onSelect={onSelect}
            onHover={setHoverIdx}
            pointAt={pointAt}
          />
        )}
      </div>

    </div>
  );
}

// ============================================================================
// SVG-дуга (десктоп) — вынесено в отдельный компонент для читабельности
// ============================================================================

function ArcSvg({
  W,
  totalH,
  arcPath,
  crisisSegments,
  dots,
  counts,
  activeIdx,
  hoverIdx,
  popoverIdx,
  popoverRef,
  getItemsAt,
  onOpen,
  onSelect,
  onHover,
  pointAt,
}: {
  W: number;
  totalH: number;
  arcPath: string;
  crisisSegments: string[];
  dots: Array<{ x: number; y: number; angle: number }>;
  counts: number[];
  activeIdx: number | null;
  hoverIdx: number | null;
  popoverIdx: number | null;
  popoverRef: React.MutableRefObject<HTMLDivElement | null>;
  getItemsAt: (i: number) => Array<{ curated: CuratedItem; full: Prediction }>;
  onOpen: (id: string) => void;
  onSelect: (i: number) => void;
  onHover: (i: number | null) => void;
  pointAt: (t: number) => { x: number; y: number; angle: number };
}) {
  return (
    <div className="relative">
      <svg
        width="100%"
        height={totalH}
        viewBox={`0 0 ${W} ${totalH}`}
        className="relative block"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={INDIGO} stopOpacity="0.9" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="arcGradientSoft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={INDIGO} stopOpacity="0.25" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0.25" />
          </linearGradient>
          <filter id="arcGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dotGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Базовая дуга */}
        <path
          d={arcPath}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Градиентная дуга поверх */}
        <path
          d={arcPath}
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Подсветка дуги (glow) */}
        <path
          d={arcPath}
          fill="none"
          stroke="url(#arcGradientSoft)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#arcGlow)"
          opacity="0.6"
        />

        {/* Кризисные сегменты */}
        {crisisSegments.map((d, i) => (
          <g key={`crisis-${i}`}>
            <path
              d={d}
              fill="none"
              stroke={ROSE}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d={d}
              fill="none"
              stroke={ROSE}
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.18"
              filter="url(#arcGlow)"
            />
          </g>
        ))}

        {/* Точки */}
        {dots.map((p, i) => {
          const isActive = activeIdx === i;
          const isHover = hoverIdx === i;
          const count = counts[i];
          const has = count > 0;
          const r = isActive ? 7 : isHover && has ? 6 : has ? 4.5 : 3;
          const fill = has
            ? isActive
              ? "#FFFFFF"
              : "rgba(255,255,255,0.92)"
            : "rgba(255,255,255,0.3)";

          return (
            <g
              key={i}
              data-arc-dot=""
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(i)}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
            >
              <circle cx={p.x} cy={p.y} r={20} fill="transparent" />

              {(isActive || (isHover && has)) && (
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 14 : 11}
                  fill="none"
                  stroke="url(#arcGradient)"
                  strokeWidth="1.5"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                />
              )}

              {isActive && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={9}
                  fill="url(#arcGradient)"
                  opacity="0.35"
                  filter="url(#dotGlow)"
                />
              )}

              <motion.circle
                cx={p.x}
                cy={p.y}
                fill={fill}
                r={r}
                initial={false}
                animate={{ r }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              />

              {has && (
                <text
                  x={p.x}
                  y={p.y - 18}
                  fill={isActive ? "#fff" : "rgba(255,255,255,0.55)"}
                  fontSize="11"
                  fontWeight="500"
                  textAnchor="middle"
                  style={{ fontFeatureSettings: '"tnum"' }}
                >
                  {count}
                </text>
              )}

              <text
                x={p.x}
                y={p.y + 24}
                fill={
                  isActive
                    ? "#fff"
                    : isHover && has
                      ? "rgba(255,255,255,0.85)"
                      : "rgba(240,240,245,0.45)"
                }
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                {QUARTERS[i].split(" ")[0]}
              </text>
              <text
                x={p.x}
                y={p.y + 38}
                fill="rgba(240,240,245,0.3)"
                fontSize="10"
                fontWeight="400"
                textAnchor="middle"
                style={{ fontFeatureSettings: '"tnum"' }}
              >
                {QUARTERS[i].split(" ")[1]}
              </text>
            </g>
          );
        })}

        {/* Метка зоны кризиса */}
        {CRISIS_RANGES.map(([a, b], i) => {
          const tMid = (a + b) / 2 / (QUARTERS.length - 1);
          const p = pointAt(tMid);
          return (
            <text
              key={`crisis-label-${i}`}
              x={p.x}
              y={p.y - 36}
              fill="#FDA4AF"
              fontSize="10"
              fontWeight="500"
              textAnchor="middle"
              opacity="0.85"
            >
              Зона кризиса
            </text>
          );
        })}
      </svg>

      {/* Поповер */}
      <AnimatePresence>
        {popoverIdx !== null && counts[popoverIdx] > 0 && (
          <ArcPopover
            popoverRef={popoverRef}
            idx={popoverIdx}
            x={dots[popoverIdx].x}
            y={dots[popoverIdx].y}
            containerWidth={W}
            items={getItemsAt(popoverIdx)}
            onOpen={onOpen}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Поповер — frosted glass карточка
// ============================================================================

function MobileQuarterList({
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
  return (
    <div className="relative space-y-1.5">
      {QUARTERS.map((q, i) => {
        const count = counts[i];
        const has = count > 0;
        const crisis = isCrisisIndex(i);
        const isActive = activeIdx === i;
        const items = isActive && has ? getItemsAt(i) : [];
        return (
          <div key={q}>
            <button
              onClick={() => onSelect(i)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-[14px] transition-colors text-left"
              style={{
                background: isActive
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(255,255,255,0.02)",
                border: `1px solid ${
                  isActive
                    ? "rgba(255,255,255,0.14)"
                    : "rgba(255,255,255,0.06)"
                }`,
              }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{
                  background: has
                    ? crisis
                      ? ROSE
                      : GRADIENT
                    : "rgba(255,255,255,0.2)",
                  boxShadow: has
                    ? `0 0 10px ${crisis ? "rgba(244,63,94,0.5)" : "rgba(99,102,241,0.5)"}`
                    : "none",
                }}
              />
              <span className="text-[13px] font-medium text-text-primary tabular-nums w-[58px] shrink-0">
                {q}
              </span>
              {crisis && (
                <span
                  className="text-[10px] font-medium uppercase tracking-[0.06em] px-1.5 py-0.5 rounded"
                  style={{
                    color: "#FDA4AF",
                    background: "rgba(244,63,94,0.1)",
                    border: "1px solid rgba(244,63,94,0.25)",
                  }}
                >
                  Кризис
                </span>
              )}
              <span className="ml-auto flex items-center gap-2 text-[12px] text-text-tertiary tabular-nums">
                {has ? `${count} прогн.` : "—"}
                {has && (
                  <ArrowUpRight
                    size={13}
                    className={`transition-transform ${
                      isActive ? "rotate-90" : ""
                    }`}
                  />
                )}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isActive && has && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 pb-1 pl-5 pr-2 space-y-1.5">
                    {items.map((m) => (
                      <li key={m.curated.id} className="list-none">
                        <button
                          onClick={() => onOpen(m.curated.id)}
                          className="w-full text-left flex items-start gap-2 py-2 group"
                        >
                          <span
                            className="mt-1.5 inline-block w-1 h-1 rounded-full shrink-0"
                            style={{ background: GRADIENT }}
                          />
                          <span className="flex-1 text-[13px] leading-[1.45] text-text-secondary group-hover:text-white transition-colors">
                            {m.curated.shortTitle}
                          </span>
                          <ArrowUpRight
                            size={13}
                            className="text-text-tertiary mt-0.5 shrink-0"
                          />
                        </button>
                      </li>
                    ))}
                  </div>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Поповер — desktop only
// ============================================================================

function ArcPopover({
  popoverRef,
  idx,
  x,
  y,
  containerWidth,
  items,
  onOpen,
}: {
  popoverRef?: React.RefObject<HTMLDivElement | null>;
  idx: number;
  x: number;
  y: number;
  containerWidth: number;
  items: Array<{ curated: CuratedItem; full: Prediction }>;
  onOpen: (id: string) => void;
}) {
  const POPOVER_W = 320;
  // Позиционирование, чтобы не вылетал по горизонтали
  let leftPx = x - POPOVER_W / 2;
  if (leftPx < 16) leftPx = 16;
  if (leftPx + POPOVER_W > containerWidth - 16)
    leftPx = containerWidth - POPOVER_W - 16;

  return (
    <motion.div
      ref={popoverRef}
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute z-30 pointer-events-none"
      style={{
        top: y + 70,
        left: leftPx,
        width: POPOVER_W,
      }}
    >
      <div
        className="rounded-[20px] p-5 pointer-events-auto"
        style={{
          background: "rgba(20,20,28,0.92)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          boxShadow:
            "0 30px 60px -20px rgba(0,0,0,0.85), 0 0 0 1px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-baseline justify-between mb-4">
          <div
            className="text-[12px] font-semibold tracking-[-0.01em] bg-clip-text text-transparent"
            style={{ backgroundImage: GRADIENT }}
          >
            {QUARTERS[idx]}
          </div>
          <div className="text-[11px] tabular-nums text-text-tertiary">
            {items.length} {items.length === 1 ? "прогноз" : "прогнозов"}
          </div>
        </div>
        <ul className="space-y-2.5">
          {items.slice(0, 3).map((m) => (
            <li key={m.curated.id}>
              <button
                onClick={() => onOpen(m.curated.id)}
                className="text-left w-full text-[13px] leading-[1.4] text-text-secondary hover:text-white transition-colors flex items-start gap-2.5 group"
              >
                <span
                  className="mt-1.5 inline-block w-1 h-1 rounded-full shrink-0"
                  style={{ background: GRADIENT }}
                />
                <span className="flex-1">{m.curated.shortTitle}</span>
                <ArrowUpRight
                  size={13}
                  className="text-text-tertiary group-hover:text-white transition-colors mt-0.5 shrink-0"
                />
              </button>
            </li>
          ))}
          {items.length > 3 && (
            <li className="text-[11px] text-text-tertiary pl-4">
              +{items.length - 3} ещё
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Карточка — Glassmorphism v2
// ============================================================================

function GlassCard({
  item,
  onOpen,
}: {
  item: CuratedItem;
  onOpen: () => void;
}) {
  const [hover, setHover] = useState(false);
  const crisisHorizon = isCrisisIndex(quarterIndex(item.quarter));

  return (
    <motion.div
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onClick={onOpen}
      className="group relative h-full min-h-[260px] rounded-[24px] p-6 flex flex-col cursor-pointer overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        boxShadow: hover
          ? "0 24px 50px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.25), 0 0 40px -8px rgba(34,211,238,0.18)"
          : "0 12px 30px -16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        transition: "box-shadow 0.35s ease, border-color 0.35s ease",
      }}
    >
      {/* Внутренний highlight сверху (как iOS widget) */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.16) 50%, transparent 100%)",
        }}
      />

      {/* Aurora glow при hover */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        animate={{ opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          top: -80,
          right: -80,
          width: 240,
          height: 240,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(34,211,238,0.15) 40%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Метаданные */}
      <div className="relative flex items-center justify-between text-[12px]">
        <span
          className="font-medium tracking-[-0.005em]"
          style={{
            color: crisisHorizon ? "#FDA4AF" : "rgba(240,240,245,0.7)",
          }}
        >
          {item.horizon}
        </span>
        <ConfidencePill confidence={item.confidence} />
      </div>

      {/* Заголовок */}
      <h3 className="relative mt-5 text-[18px] font-semibold leading-[1.25] tracking-[-0.02em] text-text-primary text-balance">
        {item.shortTitle}
      </h3>

      {/* Описание */}
      <p className="relative mt-3 text-[13.5px] text-text-secondary leading-[1.6] flex-1">
        {item.shortDescription}
      </p>

      {/* Footer */}
      <div className="relative mt-6 pt-5 border-t border-white/8 flex items-center justify-between gap-3">
        <span className="text-[11.5px] text-text-tertiary truncate">
          {item.sourceLabel}
        </span>
        <motion.span
          className="inline-flex items-center justify-center rounded-full w-8 h-8 shrink-0"
          animate={{
            background: hover
              ? GRADIENT
              : "rgba(255,255,255,0.06)",
          }}
          transition={{ duration: 0.3 }}
        >
          <ArrowUpRight
            size={15}
            className="text-white"
            style={{ opacity: hover ? 1 : 0.7 }}
          />
        </motion.span>
      </div>
    </motion.div>
  );
}

function ConfidencePill({ confidence }: { confidence: number }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium tabular-nums"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: GRADIENT }}
      />
      {confidence}%
    </div>
  );
}

// ============================================================================
// Модалка
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[720px] max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-[24px] sm:rounded-[28px] p-5 pt-12 sm:pt-7 sm:p-7 md:p-9"
        style={{
          background:
            "linear-gradient(180deg, rgba(28,28,36,0.92) 0%, rgba(14,14,20,0.92) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          boxShadow:
            "0 60px 100px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(240,240,245,0.7)",
          }}
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 text-[12px] font-medium">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: GRADIENT }}
          >
            {curated.horizon}
          </span>
          <span className="text-text-tertiary">·</span>
          <span className="text-text-secondary">
            Уверенность: {curated.confidence}% — {confidenceLabel(curated.confidence)}
          </span>
        </div>

        <h3
          id="modal-title"
          className="mt-4 text-[24px] md:text-[28px] font-semibold leading-[1.2] tracking-[-0.025em] text-text-primary text-balance"
        >
          {full.title}
        </h3>

        <p className="mt-5 text-[15px] text-text-secondary leading-[1.65]">
          {full.statement}
        </p>

        {full.evidence.length > 0 && (
          <div className="mt-7">
            <div className="text-[12px] font-medium text-text-tertiary mb-3">
              Свидетельства
            </div>
            <ul className="space-y-2.5">
              {full.evidence.map((ev, i) => (
                <li
                  key={i}
                  className="rounded-[14px] p-4 text-[13.5px] text-text-secondary leading-[1.55]"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="text-[11.5px] text-text-tertiary mb-1.5">
                    {ev.date}
                  </div>
                  {ev.note}
                  {ev.source_url && (
                    <a
                      href={ev.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 inline-flex items-center gap-1 text-[12px] hover:underline"
                      style={{ color: CYAN }}
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
          <p className="mt-5 text-[13.5px] italic text-text-tertiary leading-[1.6]">
            {full.notes}
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-white/8 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-[12px] text-text-tertiary">
            Источник: {curated.sourceLabel}
          </div>
          {curated.researchSlug && (
            <a
              href={`/research/${curated.researchSlug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all hover:scale-[1.02]"
              style={{
                background: GRADIENT,
                color: "#fff",
                boxShadow:
                  "0 12px 28px -10px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <FileText size={14} /> Перейти к исследованию
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
