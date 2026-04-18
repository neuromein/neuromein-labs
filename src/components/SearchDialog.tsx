import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Поиск по сайту: исследования, публикации, разделы…" />
      <CommandList>
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
    </CommandDialog>
  );
}

/** Hook удобно использовать снаружи */
export function useSearchDialog() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}
