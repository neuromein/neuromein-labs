// src/data/predictions.ts
// Трекер прогнозов NEUROMEIN.ru – версия 3.0
// ВНИМАНИЕ: Источник данных – БД Supabase (таблицы predictions + prediction_evidence).
// Этот файл содержит только типы, метки категорий и хелперы.
// Загрузка данных: см. src/data/predictions.fetch.ts

export type PredictionStatus =
  | "fulfilled"
  | "partial"
  | "not_fulfilled"
  | "in_progress"
  | "too_early";

export type SourceWork = "silent-replacement" | "ai-2025-forecast" | "new";

export interface Evidence {
  date: string;
  note: string;
  source_url?: string;
}

export interface Prediction {
  id: string;
  title: string;
  statement: string;
  source: {
    work: SourceWork;
    work_title: string;
    section?: string;
    page?: number;
  };
  date_made: string;
  target_horizon: string;
  categories: string[];
  status: PredictionStatus;
  status_updated: string;
  evidence: Evidence[];
  notes?: string;
}

export const CATEGORIES = {
  labor_market: "Рынок труда",
  business_models: "Бизнес-модели",
  ai_models: "Модели ИИ",
  robotics: "Робототехника",
  macroeconomy: "Макроэкономика",
  media_marketing: "Медиа и маркетинг",
  education: "Образование",
  geopolitics: "Геополитика",
  enterprise_ai: "Корпоративный ИИ",
  cybersecurity: "Кибербезопасность",
  science: "Наука и медицина",
  society: "Общество",
  regulation: "Регулирование",
  risks: "Риски и чёрные лебеди",
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const STATUS_LABELS: Record<PredictionStatus, string> = {
  fulfilled: "Сбылся",
  partial: "Частично",
  not_fulfilled: "Не сбылся",
  in_progress: "В процессе",
  too_early: "Рано судить",
};

export const STATUS_COLORS: Record<PredictionStatus, string> = {
  fulfilled: "#22c55e",
  partial: "#f59e0b",
  not_fulfilled: "#ef4444",
  in_progress: "#3b82f6",
  too_early: "#6b7280",
};

export const SOURCE_LABELS: Record<SourceWork, string> = {
  "silent-replacement": "Тихая замена",
  "ai-2025-forecast": "ИИ в 2025 и прогнозы на 2026",
  "new": "Новые прогнозы",
};

export function getStats(items: Prediction[]) {
  const total = items.length;
  const byStatus: Record<PredictionStatus, number> = {
    fulfilled: 0,
    partial: 0,
    not_fulfilled: 0,
    in_progress: 0,
    too_early: 0,
  };
  for (const p of items) {
    byStatus[p.status] = (byStatus[p.status] || 0) + 1;
  }
  const settled = byStatus.fulfilled + byStatus.partial + byStatus.not_fulfilled;
  const accuracy =
    settled > 0
      ? Math.round(((byStatus.fulfilled + byStatus.partial * 0.5) / settled) * 100)
      : null;
  return { total, byStatus, settled, accuracy };
}
