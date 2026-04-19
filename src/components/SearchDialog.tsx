import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { NAV_LINKS, PUBLICATIONS, RESEARCH } from "@/lib/site";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = (fn: () => void) => {
    onOpenChange(false);
    setTimeout(fn, 50);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Dimmed backdrop with subtle blur — like the reference */}
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={{
            background: "rgba(4, 4, 8, 0.55)",
            backdropFilter: "blur(8px) saturate(140%)",
            WebkitBackdropFilter: "blur(8px) saturate(140%)",
          }}
        />
        {/* Centered glass search panel */}
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <DialogPrimitive.Title className="sr-only">Поиск по сайту</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Поиск по разделам, исследованиям и публикациям
          </DialogPrimitive.Description>

          <CommandPrimitive
            className="flex w-full flex-col overflow-hidden rounded-2xl text-text-primary"
            style={{
              background: "rgba(14, 14, 20, 0.72)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Input row — large, like the reference screenshot */}
            <div
              className="flex items-center gap-3 px-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <SearchIcon />
              <CommandPrimitive.Input
                placeholder="Поиск…"
                className="flex h-14 w-full bg-transparent text-[16px] outline-none placeholder:text-text-tertiary"
              />
              <kbd className="hidden sm:inline-flex items-center h-6 px-1.5 rounded-md text-[11px] text-text-tertiary border border-border bg-bg-deep/60">
                ESC
              </kbd>
            </div>

            <CommandList className="max-h-[60vh] overflow-y-auto px-2 py-2">
              <CommandEmpty>Ничего не найдено.</CommandEmpty>

              <CommandGroup heading="Разделы">
                <CommandItem
                  value="главная home"
                  onSelect={() => go(() => navigate({ to: "/" }))}
                >
                  Главная
                </CommandItem>
                {NAV_LINKS.map((l) => (
                  <CommandItem
                    key={l.to}
                    value={l.label}
                    onSelect={() => go(() => navigate({ to: l.to }))}
                  >
                    {l.label}
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Исследования">
                {RESEARCH.map((r) => (
                  <CommandItem
                    key={r.slug}
                    value={`${r.title} ${r.short}`}
                    onSelect={() =>
                      go(() =>
                        navigate({ to: "/research/$slug", params: { slug: r.slug } }),
                      )
                    }
                  >
                    <div className="flex flex-col">
                      <span className="text-text-primary">{r.title}</span>
                      <span className="text-[12px] text-text-tertiary">{r.year}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Публикации">
                {PUBLICATIONS.map((p) => (
                  <CommandItem
                    key={p.slug}
                    value={`${p.title} ${p.tag} ${p.excerpt}`}
                    onSelect={() =>
                      go(() =>
                        navigate({ to: "/blog/$slug", params: { slug: p.slug } }),
                      )
                    }
                  >
                    <div className="flex flex-col">
                      <span className="text-text-primary">{p.title}</span>
                      <span className="text-[12px] text-text-tertiary">
                        {p.dateLabel} · {p.tag}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </CommandPrimitive>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="text-text-tertiary shrink-0"
    >
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Hook удобно использовать снаружи */
export function useSearchDialog() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}
