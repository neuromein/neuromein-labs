import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";

export const Route = createFileRoute("/admin/predictions")({
  head: () => ({
    meta: [
      { title: "Прогнозы — Личный кабинет" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPredictionsPage,
});

const STATUSES = [
  { value: "in_progress", label: "В процессе" },
  { value: "fulfilled", label: "Сбылся" },
  { value: "partial", label: "Частично" },
  { value: "not_fulfilled", label: "Не сбылся" },
  { value: "too_early", label: "Рано судить" },
] as const;

const STATUS_COLOR: Record<string, string> = {
  fulfilled: "#22c55e",
  partial: "#f59e0b",
  not_fulfilled: "#ef4444",
  in_progress: "#3b82f6",
  too_early: "#6b7280",
};

const SOURCE_WORKS = [
  { value: "silent-replacement", label: "Тихая замена" },
  { value: "ai-2025-forecast", label: "ИИ в 2025 и прогнозы на 2026" },
  { value: "new", label: "Новый источник" },
];

const CATEGORY_OPTIONS = [
  "labor_market", "business_models", "ai_models", "robotics", "macroeconomy",
  "media_marketing", "education", "geopolitics", "enterprise_ai",
  "cybersecurity", "science", "society", "regulation", "risks",
];

const CATEGORY_LABELS: Record<string, string> = {
  labor_market: "Рынок труда", business_models: "Бизнес-модели", ai_models: "Модели ИИ",
  robotics: "Робототехника", macroeconomy: "Макроэкономика", media_marketing: "Медиа",
  education: "Образование", geopolitics: "Геополитика", enterprise_ai: "Корп. ИИ",
  cybersecurity: "Кибербез.", science: "Наука", society: "Общество",
  regulation: "Регулирование", risks: "Риски",
};

interface PredictionRow {
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
  status: string;
  status_updated: string;
  confidence: number | null;
  notes: string | null;
  display_order: number;
}

interface EvidenceRow {
  id: string;
  prediction_id: string;
  evidence_date: string;
  note: string;
  source_url: string | null;
}

function AdminPredictionsPage() {
  const [items, setItems] = useState<PredictionRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [editing, setEditing] = useState<PredictionRow | "new" | null>(null);
  const [evidenceFor, setEvidenceFor] = useState<PredictionRow | null>(null);

  const load = useCallback(async () => {
    setLoadingData(true);
    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Не удалось загрузить прогнозы: " + error.message);
    } else {
      setItems((data ?? []) as PredictionRow[]);
    }
    setLoadingData(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Удалить прогноз «${title}»? Действие нельзя отменить.`)) return;
    const { error } = await supabase.from("predictions").delete().eq("id", id);
    if (error) {
      toast.error("Ошибка удаления: " + error.message);
    } else {
      toast.success("Прогноз удалён");
      load();
    }
  }

  return (
    <div className="max-w-[1100px] mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-text-tertiary mb-1.5">
            Раздел
          </div>
          <h1 className="text-[28px] font-medium tracking-[-0.02em] text-text-primary">
            Прогнозы
          </h1>
          <p className="text-[13px] text-text-secondary mt-1">
            Всего: {items.length} {items.length === 1 ? "запись" : items.length > 1 && items.length < 5 ? "записи" : "записей"}
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-text-primary text-bg text-[14px] font-medium hover:opacity-90"
        >
          <Plus size={14} /> Новый прогноз
        </button>
      </div>

      {loadingData ? (
        <div className="text-text-secondary text-[14px]">Загрузка…</div>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-border rounded-2xl p-12 text-center">
          <p className="text-[14px] text-text-secondary mb-4">
            Прогнозов пока нет. Добавьте первый.
          </p>
          <button
            onClick={() => setEditing("new")}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-text-primary text-bg text-[14px] font-medium"
          >
            <Plus size={14} /> Создать прогноз
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((p) => (
            <div
              key={p.id}
              className="bg-bg-card/40 border border-border rounded-xl p-4 sm:p-5 hover:bg-bg-card/60 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide"
                      style={{
                        background: `${STATUS_COLOR[p.status]}20`,
                        color: STATUS_COLOR[p.status],
                      }}
                    >
                      {STATUSES.find((s) => s.value === p.status)?.label ?? p.status}
                    </span>
                    <span className="text-[11px] text-text-tertiary">
                      {p.target_horizon}
                    </span>
                    {p.confidence != null && (
                      <span className="text-[11px] text-text-tertiary">
                        · {p.confidence}% уверенности
                      </span>
                    )}
                  </div>
                  <h3 className="text-[15px] font-medium text-text-primary mb-1">
                    {p.title}
                  </h3>
                  <p className="text-[13px] text-text-secondary line-clamp-2">
                    {p.statement}
                  </p>
                  {p.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.categories.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-bg-deep text-text-tertiary"
                        >
                          {CATEGORY_LABELS[c] ?? c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEvidenceFor(p)}
                    title="Доказательства"
                    className="h-9 w-9 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-deep transition-colors"
                  >
                    <FileText size={15} />
                  </button>
                  <button
                    onClick={() => setEditing(p)}
                    title="Редактировать"
                    className="h-9 w-9 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-deep transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    title="Удалить"
                    className="h-9 w-9 flex items-center justify-center rounded-lg text-text-tertiary hover:text-red-400 hover:bg-bg-deep transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <PredictionForm
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      {evidenceFor && (
        <EvidenceManager
          prediction={evidenceFor}
          onClose={() => setEvidenceFor(null)}
        />
      )}
    </div>
  );
}

function PredictionForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: PredictionRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !initial;
  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    statement: initial?.statement ?? "",
    source_work: initial?.source_work ?? "new",
    source_work_title: initial?.source_work_title ?? "",
    source_section: initial?.source_section ?? "",
    source_page: initial?.source_page?.toString() ?? "",
    date_made: initial?.date_made ?? new Date().toISOString().slice(0, 10),
    target_horizon: initial?.target_horizon ?? "",
    categories: initial?.categories ?? [],
    status: initial?.status ?? "in_progress",
    status_updated: initial?.status_updated ?? new Date().toISOString().slice(0, 10),
    confidence: initial?.confidence?.toString() ?? "",
    notes: initial?.notes ?? "",
    display_order: initial?.display_order?.toString() ?? "0",
  });
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function toggleCategory(c: string) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(c)
        ? f.categories.filter((x) => x !== c)
        : [...f.categories, c],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      statement: form.statement.trim(),
      source_work: form.source_work,
      source_work_title: form.source_work_title.trim(),
      source_section: form.source_section.trim() || null,
      source_page: form.source_page ? Number(form.source_page) : null,
      date_made: form.date_made,
      target_horizon: form.target_horizon.trim(),
      categories: form.categories,
      status: form.status as "fulfilled" | "in_progress" | "not_fulfilled" | "partial" | "too_early",
      status_updated: form.status_updated,
      confidence: form.confidence ? Number(form.confidence) : null,
      notes: form.notes.trim() || null,
      display_order: Number(form.display_order) || 0,
    };

    if (!payload.slug || !payload.title || !payload.statement) {
      toast.error("Заполните slug, заголовок и формулировку");
      setSaving(false);
      return;
    }

    const { error } = isNew
      ? await supabase.from("predictions").insert([payload])
      : await supabase.from("predictions").update(payload).eq("id", initial!.id);

    if (error) {
      toast.error("Ошибка: " + error.message);
    } else {
      toast.success(isNew ? "Прогноз создан" : "Прогноз обновлён");
      onSaved();
    }
    setSaving(false);
  }

  return (
    <Modal title={isNew ? "Новый прогноз" : "Редактирование"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Slug (уникальный идентификатор, латиница)">
          <input required value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="pred-001" className={inputCls} />
        </Field>
        <Field label="Заголовок">
          <input required value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Формулировка">
          <textarea required rows={4} value={form.statement} onChange={(e) => update("statement", e.target.value)} className={inputCls + " resize-y"} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Источник (работа)">
            <select value={form.source_work} onChange={(e) => update("source_work", e.target.value)} className={inputCls}>
              {SOURCE_WORKS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Название работы">
            <input required value={form.source_work_title} onChange={(e) => update("source_work_title", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Раздел (опц.)">
            <input value={form.source_section} onChange={(e) => update("source_section", e.target.value)} placeholder="гл. 2.1" className={inputCls} />
          </Field>
          <Field label="Страница (опц.)">
            <input type="number" value={form.source_page} onChange={(e) => update("source_page", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Дата прогноза">
            <input type="date" required value={form.date_made} onChange={(e) => update("date_made", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Горизонт">
            <input required value={form.target_horizon} onChange={(e) => update("target_horizon", e.target.value)} placeholder="Q1 2026 / Конец 2026 / К 2028" className={inputCls} />
          </Field>
          <Field label="Статус">
            <select value={form.status} onChange={(e) => update("status", e.target.value)} className={inputCls}>
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Дата обновления статуса">
            <input type="date" required value={form.status_updated} onChange={(e) => update("status_updated", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Уверенность (0–100, опц.)">
            <input type="number" min="0" max="100" value={form.confidence} onChange={(e) => update("confidence", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Порядок отображения">
            <input type="number" value={form.display_order} onChange={(e) => update("display_order", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Категории">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_OPTIONS.map((c) => {
              const active = form.categories.includes(c);
              return (
                <button type="button" key={c} onClick={() => toggleCategory(c)}
                  className={`text-[12px] px-2.5 py-1 rounded-full border transition-colors ${
                    active
                      ? "bg-text-primary text-bg border-text-primary"
                      : "bg-bg-deep text-text-secondary border-border hover:text-text-primary"
                  }`}>
                  {CATEGORY_LABELS[c] ?? c}
                </button>
              );
            })}
          </div>
        </Field>
        <Field label="Заметки (опц.)">
          <textarea rows={2} value={form.notes} onChange={(e) => update("notes", e.target.value)} className={inputCls + " resize-y"} />
        </Field>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <button type="button" onClick={onClose} className="h-10 px-4 rounded-lg text-[14px] text-text-secondary hover:text-text-primary">
            Отмена
          </button>
          <button type="submit" disabled={saving} className="h-10 px-5 rounded-lg bg-text-primary text-bg text-[14px] font-medium hover:opacity-90 disabled:opacity-50">
            {saving ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EvidenceManager({
  prediction,
  onClose,
}: {
  prediction: PredictionRow;
  onClose: () => void;
}) {
  const [items, setItems] = useState<EvidenceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [evDate, setEvDate] = useState(new Date().toISOString().slice(0, 10));
  const [evNote, setEvNote] = useState("");
  const [evUrl, setEvUrl] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("prediction_evidence")
      .select("*")
      .eq("prediction_id", prediction.id)
      .order("evidence_date", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data ?? []) as EvidenceRow[]);
    setLoading(false);
  }, [prediction.id]);

  useEffect(() => { load(); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!evNote.trim()) return;
    setAdding(true);
    const { error } = await supabase.from("prediction_evidence").insert({
      prediction_id: prediction.id,
      evidence_date: evDate,
      note: evNote.trim(),
      source_url: evUrl.trim() || null,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Добавлено");
      setEvNote("");
      setEvUrl("");
      load();
    }
    setAdding(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить запись?")) return;
    const { error } = await supabase.from("prediction_evidence").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Удалено"); load(); }
  }

  return (
    <Modal title={`Доказательства: ${prediction.title}`} onClose={onClose}>
      <form onSubmit={add} className="grid grid-cols-1 sm:grid-cols-[140px_1fr_auto] gap-2 mb-5">
        <input type="date" required value={evDate} onChange={(e) => setEvDate(e.target.value)} className={inputCls} />
        <div className="flex flex-col gap-2">
          <input required value={evNote} onChange={(e) => setEvNote(e.target.value)} placeholder="Заметка / событие" className={inputCls} />
          <input type="url" value={evUrl} onChange={(e) => setEvUrl(e.target.value)} placeholder="https://… (опц.)" className={inputCls} />
        </div>
        <button type="submit" disabled={adding}
          className="h-[88px] sm:h-auto px-4 rounded-lg bg-text-primary text-bg text-[14px] font-medium hover:opacity-90 disabled:opacity-50 self-stretch">
          + Добавить
        </button>
      </form>

      {loading ? (
        <div className="text-text-secondary text-[13px]">Загрузка…</div>
      ) : items.length === 0 ? (
        <div className="text-text-tertiary text-[13px] text-center py-6">Доказательств пока нет.</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((ev) => (
            <li key={ev.id} className="flex items-start gap-3 bg-bg-deep rounded-lg p-3">
              <span className="text-[11px] text-text-tertiary tabular-nums shrink-0 mt-0.5">{ev.evidence_date}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-text-primary">{ev.note}</p>
                {ev.source_url && (
                  <a href={ev.source_url} target="_blank" rel="noreferrer" className="text-[11px] text-brand hover:underline break-all">
                    {ev.source_url}
                  </a>
                )}
              </div>
              <button onClick={() => remove(ev.id)}
                className="h-7 w-7 flex items-center justify-center rounded text-text-tertiary hover:text-red-400 shrink-0">
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      <div className="bg-bg border border-border rounded-2xl w-full max-w-[720px] max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-[16px] font-medium text-text-primary truncate pr-3">{title}</h2>
          <button onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-bg-card">
            ✕
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-text-tertiary">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full h-10 px-3 rounded-lg bg-bg-card border border-border text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-secondary";
