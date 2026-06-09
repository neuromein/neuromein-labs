import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PUBLICATIONS, RESEARCH } from "@/lib/site";

type Result = {
  key: string;
  group: "Исследования" | "Публикации";
  title: string;
  subtitle?: string;
  snippet?: string; // matched fragment from full text
  score: number;
  onSelect: () => void;
};

type ExpandingSearchDockProps = {
  placeholder?: string;
  /** Controlled mode: if provided, parent owns the open state */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Visual variant for the trigger when collapsed (used inside the header) */
  triggerClassName?: string;
};

export function ExpandingSearchDock({
  placeholder = "Поиск по сайту…",
  open,
  onOpenChange,
  triggerClassName,
}: ExpandingSearchDockProps) {
  const isControlled = typeof open === "boolean";
  const [internalOpen, setInternalOpen] = useState(false);
  const isExpanded = isControlled ? (open as boolean) : internalOpen;
  const setExpanded = (v: boolean) => {
    if (!isControlled) setInternalOpen(v);
    onOpenChange?.(v);
  };

  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCollapse();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  // Build a searchable index from RESEARCH + PUBLICATIONS
  const index = useMemo(() => {
    const items: Array<{
      key: string;
      group: "Исследования" | "Публикации";
      title: string;
      subtitle: string;
      fullText: string;
      onSelect: () => void;
    }> = [];

    for (const r of RESEARCH) {
      const toc = r.toc?.map((t) => t.label).join(" ") ?? "";
      items.push({
        key: `r-${r.slug}`,
        group: "Исследования",
        title: r.title,
        subtitle: `${r.year} · ${r.short}`,
        fullText: [
          r.eyebrow,
          r.title,
          r.subtitle,
          r.year,
          r.date,
          r.short,
          r.long,
          r.summary,
          toc,
        ]
          .filter(Boolean)
          .join(" "),
        onSelect: () =>
          navigate({ to: "/research/$slug", params: { slug: r.slug } }),
      });
    }

    for (const p of PUBLICATIONS) {
      items.push({
        key: `p-${p.slug}`,
        group: "Публикации",
        title: p.title,
        subtitle: `${p.dateLabel} · ${p.tag}`,
        fullText: [p.title, p.tag, p.excerpt, p.dateLabel].filter(Boolean).join(" "),
        onSelect: () =>
          navigate({ to: "/blog/$slug", params: { slug: p.slug } }),
      });
    }

    return items;
  }, [navigate]);

  const filtered: Result[] = useMemo(() => {
    const raw = query.trim();
    if (!raw) {
      // Empty state: show nothing – only search input is visible
      return [];
    }

    const tokens = tokenize(raw).map(expandSynonyms).flat();
    if (tokens.length === 0) return [];

    const scored = index
      .map((it) => {
        const haystack = normalize(it.fullText);
        const haystackTitle = normalize(it.title);
        let score = 0;
        const matchedTerms: string[] = [];

        for (const t of tokens) {
          if (!t) continue;
          // Title hit weighs more
          if (haystackTitle.includes(t)) {
            score += 10;
            matchedTerms.push(t);
          }
          // Count occurrences in full text
          const occ = countOccurrences(haystack, t);
          if (occ > 0) {
            score += occ * 2;
            matchedTerms.push(t);
          }
        }

        // Bonus: full phrase match
        const phrase = normalize(raw);
        if (phrase.length > 2 && haystack.includes(phrase)) score += 25;

        const snippet =
          score > 0 ? extractSnippet(it.fullText, matchedTerms[0] ?? phrase) : undefined;

        return {
          key: it.key,
          group: it.group,
          title: it.title,
          subtitle: it.subtitle,
          snippet,
          score,
          onSelect: it.onSelect,
        };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored;
  }, [query, index]);

  const grouped = filtered.reduce<Record<string, Result[]>>((acc, r) => {
    (acc[r.group] ||= []).push(r);
    return acc;
  }, {});

  const handleExpand = () => setExpanded(true);
  const handleCollapse = () => {
    setExpanded(false);
    setQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filtered.length > 0) {
      filtered[0].onSelect();
      handleCollapse();
    }
  };

  return (
    <>
      {/* Trigger (collapsed pill icon) – shown only in uncontrolled mode */}
      {!isControlled && !isExpanded && (
        <button
          aria-label="Поиск (⌘K)"
          onClick={handleExpand}
          className={
            triggerClassName ??
            "flex items-center justify-center h-10 w-10 rounded-full bg-bg-deep text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          }
        >
          <Search size={15} strokeWidth={1.75} />
        </button>
      )}

      {/* Expanded overlay + dock */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Dim backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCollapse}
              className="fixed inset-0 z-[60]"
              style={{
                background: "rgba(4,4,8,0.55)",
                backdropFilter: "blur(8px) saturate(140%)",
                WebkitBackdropFilter: "blur(8px) saturate(140%)",
              }}
            />

            {/* Centered dock */}
            <motion.div
              key="dock"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed left-1/2 top-[12vh] z-[70] -translate-x-1/2 w-[92vw] max-w-[640px]"
            >
              <div
                className="flex flex-col overflow-hidden rounded-2xl text-text-primary"
                style={{
                  background: "rgba(14,14,20,0.78)",
                  backdropFilter: "blur(28px) saturate(180%)",
                  WebkitBackdropFilter: "blur(28px) saturate(180%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow:
                    "0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                {/* Input row */}
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-3 px-5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Search
                    size={18}
                    strokeWidth={1.75}
                    className="text-text-tertiary shrink-0"
                  />
                  <motion.input
                    ref={inputRef}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    autoFocus
                    className="h-14 flex-1 bg-transparent text-[16px] outline-none placeholder:text-text-tertiary"
                  />
                  <kbd className="hidden sm:inline-flex items-center h-6 px-1.5 rounded-md text-[11px] text-text-tertiary border border-border bg-bg-deep/60">
                    ESC
                  </kbd>
                  <button
                    type="button"
                    aria-label="Закрыть поиск"
                    onClick={handleCollapse}
                    className="ml-1 sm:ml-0 flex items-center justify-center h-8 w-8 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-card/60 transition-colors"
                  >
                    <X size={16} strokeWidth={1.75} />
                  </button>
                </form>

                {/* Results – only render container when there is a query */}
                {query.trim().length > 0 && (
                  <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
                    {filtered.length === 0 ? (
                      <div className="px-4 py-8 text-center text-[13px] text-text-tertiary">
                        Ничего не найдено.
                      </div>
                    ) : (
                      Object.entries(grouped).map(([group, items]) => (
                        <div key={group} className="py-1">
                          <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-text-tertiary">
                            {group}
                          </div>
                          {items.map((r) => (
                            <button
                              key={r.key}
                              onClick={() => {
                                r.onSelect();
                                handleCollapse();
                              }}
                              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors flex flex-col"
                            >
                              <span className="text-[14px] text-text-primary">
                                {highlight(r.title, query)}
                              </span>
                              {r.subtitle && (
                                <span className="text-[12px] text-text-tertiary mt-0.5">
                                  {r.subtitle}
                                </span>
                              )}
                              {r.snippet && (
                                <span className="text-[12px] text-text-secondary mt-1 leading-snug line-clamp-2">
                                  …{highlight(r.snippet, query)}…
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────── Search utilities (smart full-text matching) ─────────── */

/** Normalize: lowercase, ё→е, strip punctuation, collapse spaces */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[«»"'`(),.:;!?\-––\[\]{}/\\|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Crude Russian/English stemming – strip common suffixes/endings */
function stem(word: string): string {
  let w = word;
  // Russian endings (longest first)
  const ru = [
    "ьное", "ьном", "ьная", "ьную", "ьные", "ьных", "ьными",
    "ование", "ования", "ованию", "ованиям", "ованиями", "ованиях",
    "иями", "иях", "иям", "ями", "ях", "ям",
    "ость", "ости", "остью", "остях",
    "ение", "ения", "ению", "ением", "ении",
    "ция", "ции", "цию", "цией",
    "ого", "его", "ому", "ему", "ыми", "ими",
    "ает", "ают", "ует", "уют", "ить", "еть", "ать", "ять",
    "ами", "ями", "ах", "ях", "ов", "ев", "ей",
    "ая", "яя", "ое", "ее", "ые", "ие", "ый", "ий",
    "ам", "ям", "ом", "ем", "ой", "ей",
    "у", "ю", "а", "я", "о", "е", "ы", "и",
  ];
  for (const e of ru) {
    if (w.length > e.length + 2 && w.endsWith(e)) {
      w = w.slice(0, -e.length);
      break;
    }
  }
  // English endings
  const en = ["ization", "ational", "tional", "ingly", "ing", "edly", "ed", "es", "s", "ly", "ies"];
  for (const e of en) {
    if (w.length > e.length + 2 && w.endsWith(e)) {
      w = w.slice(0, -e.length);
      break;
    }
  }
  return w;
}

function tokenize(s: string): string[] {
  return normalize(s)
    .split(" ")
    .filter((t) => t.length > 1)
    .map(stem);
}

/** Lightweight synonym map – expands a token to several semantic variants */
const SYNONYMS: Record<string, string[]> = {
  ии: ["искусствен", "интеллект", "нейросет", "ai", "генератив"],
  ai: ["искусствен", "интеллект", "ии", "нейросет"],
  работ: ["труд", "профес", "занят", "вакан", "найм"],
  труд: ["работ", "профес", "занят", "найм"],
  замен: ["автоматиз", "увольн", "сокращ", "замещ"],
  автоматиз: ["замен", "робот"],
  прогноз: ["предсказ", "будущ", "сценар", "тренд"],
  кризис: ["рецесс", "слом", "обвал"],
  бизнес: ["компани", "корпорат", "рынок"],
  деньг: ["финанс", "доход", "затрат", "капитал", "инвест"],
  модел: ["gpt", "claude", "gemini", "llm"],
  gpt: ["openai", "модел", "llm"],
  claude: ["anthropic", "модел", "llm"],
  пузыр: ["bubble", "перегрев"],
  банк: ["финанс", "сбер"],
  обучен: ["учеб", "образован", "курс"],
  пандем: ["covid", "вирус", "карантин"],
  войн: ["конфликт", "военн"],
};

function expandSynonyms(token: string): string[] {
  const out = new Set<string>([token]);
  for (const [key, variants] of Object.entries(SYNONYMS)) {
    if (token.startsWith(key) || key.startsWith(token)) {
      out.add(key);
      for (const v of variants) out.add(v);
    }
  }
  return Array.from(out);
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let i = 0;
  while ((i = haystack.indexOf(needle, i)) !== -1) {
    count++;
    i += needle.length;
  }
  return count;
}

/** Pull a ~140-char window around the first match */
function extractSnippet(text: string, term: string): string {
  const norm = normalize(text);
  const idx = norm.indexOf(term);
  if (idx === -1) return text.slice(0, 140);
  const start = Math.max(0, idx - 60);
  const end = Math.min(text.length, idx + 80);
  return text.slice(start, end).trim();
}

/** Highlight tokens from query inside text */
function highlight(text: string, query: string) {
  const tokens = Array.from(
    new Set(tokenize(query).flatMap(expandSynonyms).filter((t) => t.length > 1)),
  );
  if (tokens.length === 0) return text;
  // Build a regex that matches any token at word-start (case-insensitive)
  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) =>
        re.test(part) ? (
          <mark
            key={i}
            className="bg-brand/25 text-text-primary rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
