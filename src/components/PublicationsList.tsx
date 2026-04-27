import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
    <div className="relative mt-8 rounded-[28px] border-[0.5px] border-border bg-bg-deep overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/4 w-[600px] h-[400px] rounded-full opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.62 0.16 245 / 0.4) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <ul className="relative divide-y divide-border">
        {list.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.1}>
            <li>
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 px-6 lg:px-10 py-7 cursor-pointer"
              >
                {/* Hover sweep */}
                <motion.div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, oklch(0.62 0.16 245 / 0.06) 50%, transparent 100%)",
                  }}
                />
                <span
                  className="relative text-[12px] tabular-nums shrink-0 w-[140px] tracking-wide uppercase"
                  style={{ color: "#7a7a8a" }}
                >
                  {p.dateLabel}
                </span>
                <span className="relative flex-1 min-w-0">
                  <span className="block text-[16px] lg:text-[18px] text-text-primary leading-[1.3] tracking-[-0.01em] group-hover:underline underline-offset-4 decoration-[1px] decoration-text-primary/50 transition-colors duration-300">
                    {p.title}
                  </span>
                  <span
                    className="block mt-1.5 text-[13px] leading-[1.4] truncate"
                    style={{ color: "#7a7a8a" }}
                    title={p.excerpt}
                  >
                    {p.excerpt}
                  </span>
                </span>
                <span className="relative flex items-center gap-3 shrink-0">
                  {p.telegramUrl && (
                    <a
                      href={p.telegramUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="Оригинальный пост в Telegram"
                      aria-label="Оригинальный пост в Telegram"
                      className="inline-flex items-center justify-center h-7 w-7 rounded-full border-[0.5px] border-border-strong bg-bg-card/60 text-[#4A9EF5] hover:text-[#7eb8f8] hover:border-[#4A9EF5]/40 transition-colors"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M21.95 4.32c.32-1.32-.46-1.86-1.32-1.55L2.78 9.9c-1.27.5-1.25 1.21-.22 1.53l4.62 1.44 10.7-6.74c.5-.33.96-.15.58.18l-8.66 7.83-.34 4.83c.5 0 .72-.22.99-.48l2.37-2.3 4.92 3.63c.9.5 1.55.24 1.78-.83l3.22-15.13z" />
                      </svg>
                    </a>
                  )}
                  <span className="inline-flex items-center h-7 px-3 rounded-full border-[0.5px] border-border-strong bg-bg-card/60 text-[11px] text-text-secondary tracking-[0.04em] uppercase">
                    {p.tag}
                  </span>
                  <span
                    aria-hidden
                    className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full border-[0.5px] border-border bg-bg-card/40 text-text-tertiary group-hover:text-text-primary group-hover:border-brand/40 transition-all duration-300"
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M5 11L11 5M11 5H6M11 5v5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
