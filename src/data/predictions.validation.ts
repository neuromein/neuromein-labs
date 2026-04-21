import { z } from "zod";
import {
  predictions,
  CATEGORIES,
  type Prediction,
} from "./predictions";

const PredictionStatusEnum = z.enum([
  "fulfilled",
  "partial",
  "not_fulfilled",
  "in_progress",
  "too_early",
]);

const SourceWorkEnum = z.enum(["silent-replacement", "ai-2025-forecast", "new"]);

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "ожидается формат YYYY-MM-DD");

const EvidenceSchema = z.object({
  date: isoDate,
  note: z.string().min(1, "пустой note"),
  source_url: z.string().url().optional(),
});

const SourceSchema = z.object({
  work: SourceWorkEnum,
  work_title: z.string().min(1),
  section: z.string().optional(),
  page: z.number().int().positive().optional(),
});

const categoryKeys = Object.keys(CATEGORIES) as [string, ...string[]];
const CategoryEnum = z.enum(categoryKeys);

const PredictionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  statement: z.string().min(1),
  source: SourceSchema,
  date_made: isoDate,
  target_horizon: z.string().min(1),
  categories: z.array(CategoryEnum).min(1, "хотя бы одна категория"),
  status: PredictionStatusEnum,
  status_updated: isoDate,
  evidence: z.array(EvidenceSchema),
  notes: z.string().optional(),
});

export interface ValidationIssue {
  predictionId: string;
  predictionTitle: string;
  path: string;
  message: string;
}

export interface ValidationReport {
  totalChecked: number;
  invalidCount: number;
  duplicateIds: string[];
  issues: ValidationIssue[];
}

export function validatePredictions(
  items: Prediction[] = predictions,
): ValidationReport {
  const issues: ValidationIssue[] = [];
  const seen = new Map<string, number>();
  const duplicates = new Set<string>();
  const invalidIds = new Set<string>();

  items.forEach((item, idx) => {
    const id = (item as { id?: unknown })?.id;
    if (typeof id === "string") {
      if (seen.has(id)) duplicates.add(id);
      else seen.set(id, idx);
    }

    const result = PredictionSchema.safeParse(item);
    if (!result.success) {
      invalidIds.add(typeof id === "string" ? id : `#${idx}`);
      result.error.issues.forEach((zi) => {
        issues.push({
          predictionId: typeof id === "string" ? id : `#${idx}`,
          predictionTitle:
            typeof (item as { title?: unknown })?.title === "string"
              ? ((item as { title: string }).title)
              : "(без заголовка)",
          path: zi.path.join(".") || "(корень)",
          message: zi.message,
        });
      });
    }
  });

  duplicates.forEach((dupId) => {
    issues.push({
      predictionId: dupId,
      predictionTitle: "—",
      path: "id",
      message: `дубликат id: "${dupId}"`,
    });
    invalidIds.add(dupId);
  });

  return {
    totalChecked: items.length,
    invalidCount: invalidIds.size,
    duplicateIds: Array.from(duplicates),
    issues,
  };
}