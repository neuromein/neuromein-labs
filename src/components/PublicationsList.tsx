import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import type { Publication } from "@/data/publications.fetch";

/**
 * Премиальная лента публикаций в стиле madiyour:
 * - тёмная карточка-контейнер с тонкой градиентной подсветкой
 * - строки с hover-эффектом (фон скользит слева направо)
 * - крупная типографика, monospaced даты
 *
 * Источник данных передаётся пропсом (БД через fetchPublications).
 * Если ничего не передано — берётся пустой массив (компонент не падает).
 */
export function PublicationsList({
  items,
  limit,
}: {
  items: Publication[];
  /** Если задан — показать только первые N публикаций. */
  limit?: number;
}) {
  const list = typeof limit === "number" ? items.slice(0, limit) : items;
  if (list.length === 0) return null;
  return (
    <div className="relative mt-10">
      <ul className="grid gap-3">
        {list.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.1}>
            <li className="group relative overflow-hidden rounded-[16px] border-[0.5px] border-border bg-bg-deep/80 transition-colors duration-300 hover:border-border-strong hover:bg-bg-card/70">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between lg:p-6">
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="min-w-0 flex-1 focus:outline-none"
                >
                  <span className="mb-3 flex flex-wrap items-center gap-2 text-[12px] text-text-tertiary">
                    <time className="tabular-nums">{p.dateLabel}</time>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center rounded-full border-[0.5px] border-border-strong bg-bg-card/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.04em] text-text-secondary">
                      {p.tag}
                    </span>
                  </span>
                  <span className="block text-[20px] font-medium leading-[1.2] text-text-primary transition-colors duration-300 group-hover:text-brand sm:text-[24px]">
                    {p.title}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-text-secondary transition-colors duration-300 group-hover:text-text-primary">
                    Читать полностью на сайте
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M5 11L11 5M11 5H6M11 5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
                {p.telegramUrl && (
                  <a
                    href={p.telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Оригинал в Telegram"
                    aria-label="Оригинал в Telegram"
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border-[0.5px] border-border-strong bg-bg-card/70 px-4 text-[13px] font-medium text-brand transition-colors hover:border-brand/50 hover:text-text-primary sm:w-11 sm:px-0"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M21.95 4.32c.32-1.32-.46-1.86-1.32-1.55L2.78 9.9c-1.27.5-1.25 1.21-.22 1.53l4.62 1.44 10.7-6.74c.5-.33.96-.15.58.18l-8.66 7.83-.34 4.83c.5 0 .72-.22.99-.48l2.37-2.3 4.92 3.63c.9.5 1.55.24 1.78-.83l3.22-15.13z" />
                    </svg>
                    <span className="sm:sr-only">Оригинал в Telegram</span>
                  </a>
                )}
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
