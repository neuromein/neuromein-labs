import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  X,
  CalendarIcon,
  ExternalLink,
  FileText,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatPublicationDate } from "@/data/publications.fetch";

export const Route = createFileRoute("/admin/publications")({
  head: () => ({
    meta: [
      { title: "Публикации — Личный кабинет" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPublicationsPage,
});

const TAGS = ["Мнение", "Разбор", "ИИ и работа", "Прогнозы", "Новость"] as const;

interface PublicationRow {
  id: string;
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  body: string;
  published_at: string;
  telegram_url: string | null;
  is_visible: boolean;
  display_order: number;
}

function emptyDraft(): PublicationRow {
  return {
    id: "",
    slug: "",
    title: "",
    tag: "Мнение",
    excerpt: "",
    body: "",
    published_at: new Date().toISOString().slice(0, 10),
    telegram_url: "https://t.me/neuromein",
    is_visible: true,
    display_order: 0,
  };
}

/** RU title -> latin slug. */
function slugify(input: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh",
    щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return input
    .toLowerCase()
    .split("")
    .map((ch) => (map[ch] !== undefined ? map[ch] : ch))
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function AdminPublicationsPage() {
  const [rows, setRows] = useState<PublicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<PublicationRow>(emptyDraft());
  const [isNew, setIsNew] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch all (incl. hidden) for the admin view
  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("publications")
      .select("*")
      .order("published_at", { ascending: false })
      .order("display_order", { ascending: true });
    if (error) {
      toast.error("Не удалось загрузить публикации", { description: error.message });
    } else {
      setRows((data ?? []) as unknown as PublicationRow[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    const channel = supabase
      .channel("admin-publications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "publications" },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.excerpt.toLowerCase().includes(q) ||
        r.tag.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q),
    );
  }, [rows, search]);

  function openNew() {
    setDraft(emptyDraft());
    setIsNew(true);
    setEditorOpen(true);
  }

  function openEdit(row: PublicationRow) {
    setDraft({ ...row });
    setIsNew(false);
    setEditorOpen(true);
  }

  async function handleSave() {
    // Validation
    const title = draft.title.trim();
    if (!title) {
      toast.error("Введите заголовок публикации");
      return;
    }
    if (!draft.published_at) {
      toast.error("Укажите дату публикации");
      return;
    }
    let slug = draft.slug.trim() || slugify(title);
    if (!slug) slug = `post-${Date.now()}`;

    setSaving(true);
    try {
      if (isNew) {
        const { error } = await supabase.from("publications").insert({
          slug,
          title,
          tag: draft.tag,
          excerpt: draft.excerpt.trim(),
          body: draft.body,
          published_at: draft.published_at,
          telegram_url: draft.telegram_url?.trim() || null,
          is_visible: draft.is_visible,
          display_order: draft.display_order,
        });
        if (error) throw error;
        toast.success("Публикация создана");
      } else {
        const { error } = await supabase
          .from("publications")
          .update({
            slug,
            title,
            tag: draft.tag,
            excerpt: draft.excerpt.trim(),
            body: draft.body,
            published_at: draft.published_at,
            telegram_url: draft.telegram_url?.trim() || null,
            is_visible: draft.is_visible,
            display_order: draft.display_order,
          })
          .eq("id", draft.id);
        if (error) throw error;
        toast.success("Публикация обновлена");
      }
      setEditorOpen(false);
      await load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Неизвестная ошибка";
      toast.error("Не удалось сохранить", { description: msg });
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleVisibility(row: PublicationRow) {
    // optimistic
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, is_visible: !row.is_visible } : r)),
    );
    const { error } = await supabase
      .from("publications")
      .update({ is_visible: !row.is_visible })
      .eq("id", row.id);
    if (error) {
      toast.error("Не удалось изменить видимость", { description: error.message });
      // revert
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, is_visible: row.is_visible } : r)),
      );
    } else {
      toast.success(!row.is_visible ? "Опубликовано на сайте" : "Скрыто с сайта");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    const { error } = await supabase.from("publications").delete().eq("id", id);
    if (error) {
      toast.error("Не удалось удалить", { description: error.message });
    } else {
      toast.success("Публикация удалена");
      await load();
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-medium text-text-primary tracking-[-0.02em]">
            Публикации
          </h1>
          <p className="text-[13px] text-text-tertiary mt-1">
            {rows.length} {pluralizeRu(rows.length, ["запись", "записи", "записей"])} ·
            видимых на сайте: {rows.filter((r) => r.is_visible).length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по заголовку…"
              className="pl-8 w-[240px] h-9"
            />
          </div>
          <Button onClick={openNew} size="sm" className="gap-1.5">
            <Plus size={15} /> Новая публикация
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="text-text-secondary text-[14px]">Загрузка…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-bg-card/40 p-10 text-center text-text-tertiary">
          {search ? "Ничего не найдено по запросу" : "Пока нет публикаций. Нажмите «Новая публикация»."}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((row) => (
            <article
              key={row.id}
              className={cn(
                "rounded-xl border border-border bg-bg-card/40 p-4 sm:p-5 transition-opacity",
                !row.is_visible && "opacity-55",
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-[11px] tabular-nums text-text-tertiary uppercase tracking-wide">
                      {formatPublicationDate(row.published_at)}
                    </span>
                    <span className="inline-flex items-center h-5 px-2 rounded-full border border-border-strong bg-bg-card/60 text-[10px] uppercase tracking-wide text-text-secondary">
                      {row.tag}
                    </span>
                    {!row.is_visible && (
                      <span className="inline-flex items-center h-5 px-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-[10px] uppercase tracking-wide text-amber-400">
                        Скрыт
                      </span>
                    )}
                    <code className="text-[11px] text-text-tertiary/70 truncate">
                      /blog/{row.slug}
                    </code>
                  </div>
                  <h3 className="text-[15px] font-medium text-text-primary leading-snug">
                    {row.title}
                  </h3>
                  {row.telegram_url && (
                    <a
                      href={row.telegram_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-[#4A9EF5] hover:text-[#7eb8f8] transition-colors break-all"
                      title="Открыть пост в Telegram"
                    >
                      <TelegramIcon />
                      <span className="truncate max-w-[420px]">{row.telegram_url}</span>
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={`/blog/${row.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-card/80 transition-colors"
                    title="Открыть на сайте"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => handleToggleVisibility(row)}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-card/80 transition-colors"
                    title={row.is_visible ? "Скрыть с сайта" : "Показать на сайте"}
                  >
                    {row.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => openEdit(row)}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-card/80 transition-colors"
                    title="Редактировать"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(row.id)}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Editor dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-[720px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText size={16} />
              {isNew ? "Новая публикация" : "Редактировать публикацию"}
            </DialogTitle>
            <DialogDescription>
              Все изменения после сохранения сразу появятся на сайте в разделе «Публикации».
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="pub-title">Заголовок *</Label>
              <Input
                id="pub-title"
                value={draft.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    title,
                    // auto-fill slug only when creating and slug is still empty
                    slug: isNew && !d.slug ? slugify(title) : d.slug,
                  }));
                }}
                placeholder="Например: Google выпустил Gemini для macOS"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="pub-date">Дата публикации *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="pub-date"
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal h-9",
                        !draft.published_at && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
                      {draft.published_at
                        ? format(parseLocalDate(draft.published_at), "d MMMM yyyy", {
                            locale: ru,
                          })
                        : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        draft.published_at ? parseLocalDate(draft.published_at) : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          setDraft((d) => ({
                            ...d,
                            published_at: formatLocalDate(date),
                          }));
                        }
                      }}
                      initialFocus
                      locale={ru}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="pub-tag">Рубрика</Label>
                <Select
                  value={draft.tag}
                  onValueChange={(v) => setDraft((d) => ({ ...d, tag: v }))}
                >
                  <SelectTrigger id="pub-tag" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TAGS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="pub-slug">URL-адрес (slug)</Label>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-text-tertiary shrink-0">/blog/</span>
                <Input
                  id="pub-slug"
                  value={draft.slug}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-")
                        .replace(/-+/g, "-"),
                    }))
                  }
                  placeholder="auto"
                />
              </div>
              <p className="text-[11px] text-text-tertiary">
                Заполнится автоматически из заголовка. Только латиница, цифры и дефис.
              </p>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="pub-excerpt">Короткое описание</Label>
              <Textarea
                id="pub-excerpt"
                value={draft.excerpt}
                onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
                placeholder="1–2 предложения, которые показываются в списке публикаций"
                rows={2}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="pub-body">Текст публикации</Label>
              <Textarea
                id="pub-body"
                value={draft.body}
                onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                placeholder="Полный текст поста. Переносы строк сохраняются."
                rows={12}
                className="font-mono text-[13px]"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="pub-tg">Ссылка на пост в Telegram</Label>
              <Input
                id="pub-tg"
                value={draft.telegram_url ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, telegram_url: e.target.value }))
                }
                placeholder="https://t.me/neuromein/123"
              />
            </div>

            <label className="flex items-center gap-2 text-[13px] text-text-secondary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={draft.is_visible}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, is_visible: e.target.checked }))
                }
                className="h-4 w-4 accent-brand"
              />
              Показывать на сайте
            </label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setEditorOpen(false)}
              disabled={saving}
            >
              <X size={14} className="mr-1" /> Отмена
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-1.5">
              <Save size={14} /> {saving ? "Сохранение…" : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить публикацию?</AlertDialogTitle>
            <AlertDialogDescription>
              Действие нельзя отменить. Если хотите временно убрать пост с сайта, лучше
              воспользуйтесь кнопкой «Скрыть» (глазок).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-500/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function pluralizeRu(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

/** Parse "YYYY-MM-DD" as local date (no timezone shift). */
function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Format local Date as "YYYY-MM-DD" (no timezone shift). */
function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}