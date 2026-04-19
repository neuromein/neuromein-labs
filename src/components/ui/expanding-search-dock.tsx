import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { NAV_LINKS, PUBLICATIONS, RESEARCH } from "@/lib/site";

type Result = {
  key: string;
  group: "Разделы" | "Исследования" | "Публикации";
  title: string;
  subtitle?: string;
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

  // Build results from site data
  const allResults: Result[] = [
    {
      key: "home",
      group: "Разделы",
      title: "Главная",
      onSelect: () => navigate({ to: "/" }),
    },
    ...NAV_LINKS.map((l) => ({
      key: `nav-${l.to}`,
      group: "Разделы" as const,
      title: l.label,
      onSelect: () => navigate({ to: l.to }),
    })),
    ...RESEARCH.map((r) => ({
      key: `r-${r.slug}`,
      group: "Исследования" as const,
      title: r.title,
      subtitle: `${r.year} · ${r.short}`,
      onSelect: () =>
        navigate({ to: "/research/$slug", params: { slug: r.slug } }),
    })),
    ...PUBLICATIONS.map((p) => ({
      key: `p-${p.slug}`,
      group: "Публикации" as const,
      title: p.title,
      subtitle: `${p.dateLabel} · ${p.tag}`,
      onSelect: () =>
        navigate({ to: "/blog/$slug", params: { slug: p.slug } }),
    })),
  ];

  const q = query.trim().toLowerCase();
  const filtered = q
    ? allResults.filter((r) =>
        `${r.title} ${r.subtitle ?? ""}`.toLowerCase().includes(q),
      )
    : allResults.slice(0, 6);

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
      {/* Trigger (collapsed pill icon) — shown only in uncontrolled mode */}
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

                {/* Results */}
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
                              {r.title}
                            </span>
                            {r.subtitle && (
                              <span className="text-[12px] text-text-tertiary mt-0.5">
                                {r.subtitle}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
