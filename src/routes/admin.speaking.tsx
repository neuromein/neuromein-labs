import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Search, X, CalendarIcon,
  ExternalLink, Mic, Save, Upload, ImageIcon, Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatEventDate } from "@/data/speaking.fetch";

export const Route = createFileRoute("/admin/speaking")({
  head: () => ({
    meta: [
      { title: "Выступления – Личный кабинет" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminSpeakingPage,
});

interface Row {
  id: string;
  slug: string;
  organization: string;
  role: string;
  caption: string;
  description: string;
  image_url: string;
  event_date: string | null;
  location: string | null;
  external_url: string | null;
  is_visible: boolean;
  display_order: number;
}

function emptyDraft(): Row {
  return {
    id: "",
    slug: "",
    organization: "",
    role: "Спикер-эксперт",
    caption: "",
    description: "",
    image_url: "",
    event_date: new Date().toISOString().slice(0, 10),
    location: "",
    external_url: "",
    is_visible: true,
    display_order: 0,
  };
}

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

function AdminSpeakingPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<Row>(emptyDraft());
  const [isNew, setIsNew] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("speaking_engagements")
      .select("*")
      .order("display_order", { ascending: true })
      .order("event_date", { ascending: false });
    if (error) {
      toast.error("Не удалось загрузить выступления", { description: error.message });
    } else {
      setRows((data ?? []) as unknown as Row[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    const channel = supabase
      .channel("admin-speaking")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "speaking_engagements" },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.organization.toLowerCase().includes(q) ||
        r.caption.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q),
    );
  }, [rows, search]);

  function openNew() {
    setDraft(emptyDraft());
    setIsNew(true);
    setEditorOpen(true);
  }

  function openEdit(row: Row) {
    setDraft({ ...row, location: row.location ?? "", external_url: row.external_url ?? "" });
    setIsNew(false);
    setEditorOpen(true);
  }

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Выберите файл изображения");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Размер файла не должен превышать 8 МБ");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("speaking-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadErr) throw uploadErr;
      const { data } = supabase.storage.from("speaking-images").getPublicUrl(path);
      setDraft((d) => ({ ...d, image_url: data.publicUrl }));
      toast.success("Фото загружено");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Неизвестная ошибка";
      toast.error("Не удалось загрузить фото", { description: msg });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSave() {
    const organization = draft.organization.trim();
    if (!organization) {
      toast.error("Введите название организации");
      return;
    }
    if (!draft.image_url) {
      toast.error("Загрузите фото");
      return;
    }
    let slug = draft.slug.trim() || slugify(organization);
    if (!slug) slug = `event-${Date.now()}`;

    setSaving(true);
    try {
      const payload = {
        slug,
        organization,
        role: draft.role.trim() || "Спикер",
        caption: draft.caption.trim(),
        description: draft.description,
        image_url: draft.image_url,
        event_date: draft.event_date || null,
        location: draft.location?.trim() || null,
        external_url: draft.external_url?.trim() || null,
        is_visible: draft.is_visible,
        display_order: draft.display_order,
      };
      if (isNew) {
        const { error } = await supabase.from("speaking_engagements").insert(payload);
        if (error) throw error;
        toast.success("Выступление добавлено");
      } else {
        const { error } = await supabase
          .from("speaking_engagements")
          .update(payload)
          .eq("id", draft.id);
        if (error) throw error;
        toast.success("Выступление обновлено");
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

  async function handleToggleVisibility(row: Row) {
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, is_visible: !row.is_visible } : r)),
    );
    const { error } = await supabase
      .from("speaking_engagements")
      .update({ is_visible: !row.is_visible })
      .eq("id", row.id);
    if (error) {
      toast.error("Не удалось изменить видимость", { description: error.message });
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
    const { error } = await supabase.from("speaking_engagements").delete().eq("id", id);
    if (error) {
      toast.error("Не удалось удалить", { description: error.message });
    } else {
      toast.success("Выступление удалено");
      await load();
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <header className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-medium text-text-primary tracking-[-0.02em]">
            Выступления и обучения
          </h1>
          <p className="text-[13px] text-text-tertiary mt-1">
            {rows.length} {pluralizeRu(rows.length, ["карточка", "карточки", "карточек"])} ·
            видимых на сайте: {rows.filter((r) => r.is_visible).length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по организации…"
              className="pl-8 w-[240px] h-9"
            />
          </div>
          <Button onClick={openNew} size="sm" className="gap-1.5">
            <Plus size={15} /> Новое выступление
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="text-text-secondary text-[14px]">Загрузка…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-bg-card/40 p-10 text-center text-text-tertiary">
          {search ? "Ничего не найдено" : "Пока нет выступлений. Нажмите «Новое выступление»."}
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
                {/* Thumb */}
                <div className="shrink-0 w-[88px] h-[66px] rounded-md overflow-hidden bg-bg-deep border border-border">
                  {row.image_url ? (
                    <img src={row.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                      <ImageIcon size={20} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    {row.event_date && (
                      <span className="text-[11px] tabular-nums text-text-tertiary uppercase tracking-wide">
                        {formatEventDate(row.event_date)}
                      </span>
                    )}
                    <span className="inline-flex items-center h-5 px-2 rounded-full border border-border-strong bg-bg-card/60 text-[10px] uppercase tracking-wide text-text-secondary">
                      {row.role}
                    </span>
                    {!row.is_visible && (
                      <span className="inline-flex items-center h-5 px-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-[10px] uppercase tracking-wide text-amber-400">
                        Скрыт
                      </span>
                    )}
                    <code className="text-[11px] text-text-tertiary/70 truncate">
                      /speaking/{row.slug}
                    </code>
                  </div>
                  <h3 className="text-[15px] font-medium text-text-primary leading-snug">
                    {row.organization}
                  </h3>
                  {row.caption && (
                    <p className="mt-1 text-[12.5px] text-text-secondary line-clamp-2">
                      {row.caption}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={`/speaking/${row.slug}`}
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

      {/* Editor */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-[720px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mic size={16} />
              {isNew ? "Новое выступление" : "Редактировать выступление"}
            </DialogTitle>
            <DialogDescription>
              Изменения сразу появятся на сайте в разделе «Выступления и обучения».
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Image upload */}
            <div className="grid gap-1.5">
              <Label>Фото *</Label>
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-[160px] h-[120px] rounded-md overflow-hidden bg-bg-deep border border-border">
                  {draft.image_url ? (
                    <img src={draft.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(f);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-1.5 w-fit"
                  >
                    {uploading ? (
                      <><Loader2 size={14} className="animate-spin" /> Загрузка…</>
                    ) : (
                      <><Upload size={14} /> {draft.image_url ? "Заменить фото" : "Загрузить фото"}</>
                    )}
                  </Button>
                  <p className="text-[11px] text-text-tertiary">
                    JPEG/PNG, до 8 МБ. Пропорции 4:3 смотрятся лучше всего.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="sp-org">Организация *</Label>
              <Input
                id="sp-org"
                value={draft.organization}
                onChange={(e) => {
                  const organization = e.target.value;
                  setDraft((d) => ({
                    ...d,
                    organization,
                    slug: isNew && !d.slug ? slugify(organization) : d.slug,
                  }));
                }}
                placeholder="Например: Центральный Банк Армении"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="sp-role">Роль</Label>
                <Input
                  id="sp-role"
                  value={draft.role}
                  onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
                  placeholder="Спикер-эксперт"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sp-date">Дата события</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="sp-date"
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal h-9",
                        !draft.event_date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
                      {draft.event_date
                        ? format(parseLocalDate(draft.event_date), "d MMMM yyyy", { locale: ru })
                        : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={draft.event_date ? parseLocalDate(draft.event_date) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setDraft((d) => ({ ...d, event_date: formatLocalDate(date) }));
                        }
                      }}
                      initialFocus
                      locale={ru}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="sp-loc">Место проведения</Label>
              <Input
                id="sp-loc"
                value={draft.location ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                placeholder="Москва · необязательно"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="sp-caption">Краткое описание (для слайдера)</Label>
              <Textarea
                id="sp-caption"
                value={draft.caption}
                onChange={(e) => setDraft((d) => ({ ...d, caption: e.target.value }))}
                placeholder="1–2 предложения, что было"
                rows={2}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="sp-desc">Подробное описание (для отдельной страницы)</Label>
              <Textarea
                id="sp-desc"
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                placeholder="Расскажите подробнее: о чём говорили, что обсудили, какие итоги."
                rows={8}
                className="font-mono text-[13px]"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="sp-url">Ссылка на материал / видео</Label>
              <Input
                id="sp-url"
                value={draft.external_url ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, external_url: e.target.value }))}
                placeholder="https://… · необязательно"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="sp-slug">URL-адрес (slug)</Label>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-text-tertiary shrink-0">/speaking/</span>
                <Input
                  id="sp-slug"
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
            </div>

            <label className="flex items-center gap-2 text-[13px] text-text-secondary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={draft.is_visible}
                onChange={(e) => setDraft((d) => ({ ...d, is_visible: e.target.checked }))}
                className="h-4 w-4 accent-brand"
              />
              Показывать на сайте
            </label>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditorOpen(false)} disabled={saving}>
              <X size={14} className="mr-1" /> Отмена
            </Button>
            <Button onClick={handleSave} disabled={saving || uploading} className="gap-1.5">
              <Save size={14} /> {saving ? "Сохранение…" : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить выступление?</AlertDialogTitle>
            <AlertDialogDescription>
              Действие нельзя отменить. Если хотите временно убрать карточку, лучше воспользуйтесь кнопкой «Скрыть» (глазок).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-500/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function pluralizeRu(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}