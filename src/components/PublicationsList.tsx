import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { PUBLICATIONS } from "@/lib/site";

/**
 * Премиальная лента публикаций в стиле madiyour:
 * - тёмная карточка-контейнер с тонкой градиентной подсветкой
 * - строки с hover-эффектом (фон скользит слева направо)
 * - крупная типографика, monospaced даты
 */
export function PublicationsList() {
  const items = PUBLICATIONS.slice(0, 4);
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
        {items.map((p, i) => (
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
