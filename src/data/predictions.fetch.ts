// Fetches predictions and evidence from Supabase, assembles into Prediction[]
import { supabase } from "@/integrations/supabase/client";
import type { Prediction, PredictionStatus, SourceWork } from "./predictions";

interface DbPrediction {
  id: string;
  slug: string;
  title: string;
  statement: string;
  source_work: string;
  source_work_title: string;
  source_section: string | null;
  source_page: number | null;
  date_made: string;
  target_horizon: string;
  categories: string[];
  status: PredictionStatus;
  status_updated: string;
  notes: string | null;
  display_order: number;
}

interface DbEvidence {
  id: string;
  prediction_id: string;
  evidence_date: string;
  note: string;
  source_url: string | null;
}

export async function fetchPredictions(): Promise<Prediction[]> {
  const [{ data: preds, error: pErr }, { data: evs, error: eErr }] =
    await Promise.all([
      supabase
        .from("predictions")
        .select("*")
        .eq("is_visible", true)
        .order("display_order", { ascending: true }),
      supabase
        .from("prediction_evidence")
        .select("*")
        .order("evidence_date", { ascending: true }),
    ]);

  if (pErr) throw pErr;
  if (eErr) throw eErr;

  const evByPred = new Map<string, DbEvidence[]>();
  (evs ?? []).forEach((e) => {
    const arr = evByPred.get(e.prediction_id) ?? [];
    arr.push(e as DbEvidence);
    evByPred.set(e.prediction_id, arr);
  });

  return (preds ?? []).map((row): Prediction => {
    const r = row as unknown as DbPrediction;
    return {
      id: r.slug,
      title: r.title,
      statement: r.statement,
      source: {
        work: r.source_work as SourceWork,
        work_title: r.source_work_title,
        section: r.source_section ?? undefined,
        page: r.source_page ?? undefined,
      },
      date_made: r.date_made,
      target_horizon: r.target_horizon,
      categories: r.categories,
      status: r.status,
      status_updated: r.status_updated,
      evidence: (evByPred.get(r.id) ?? []).map((e) => ({
        date: e.evidence_date,
        note: e.note,
        source_url: e.source_url ?? undefined,
      })),
      notes: r.notes ?? undefined,
    };
  });
}
