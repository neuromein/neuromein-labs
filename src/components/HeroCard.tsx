import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { DisplayHeading } from "./DisplayHeading";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Hero:
 * - без `title` — главная: кинематографичный полноэкранный hero с типографикой-героем,
 *   aurora-фоном, тонкой dot-grid сеткой и моно-метаданными.
 * - с `title` — внутренние страницы (about и т.п.): крупный заголовок + подзаголовок.
 */
export function HeroCard({
  title,
  subtitle,
  children,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  socials?: boolean;
  children?: ReactNode;
}) {
  // Variant for internal pages
  if (title) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="relative overflow-hidden rounded-[20px] noise-overlay"
        style={{
          background: "linear-gradient(180deg, #0e0e16 0%, #08080d 100%)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="aurora-bg" aria-hidden />
        <div className="relative z-10 p-7 sm:p-10 lg:p-16">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease }}
            className="font-display-serif max-w-[18ch]"
            style={{
              fontSize: "clamp(40px, 7vw, 88px)",
              lineHeight: 1.02,
              color: "#f0f0f5",
            }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease }}
              className="mt-6 leading-[1.55] max-w-[640px]"
              style={{ fontSize: 18, color: "#9a9aaa" }}
            >
              {subtitle}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7, ease }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </motion.section>
    );
  }

  // Home hero — cinematic typography
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease }}
      className="relative overflow-hidden rounded-[20px] noise-overlay"
      style={{
        background: "linear-gradient(180deg, #0d0d14 0%, #07070b 100%)",
        border: "1px solid rgba(255,255,255,0.05)",
        minHeight: "min(82vh, 760px)",
      }}
    >
      {/* Aurora */}
      <div className="aurora-bg" aria-hidden />

      {/* Тонкая dot-grid сетка */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)",
        }}
      />

      <div className="relative z-10 px-6 sm:px-10 lg:px-16 pt-14 sm:pt-20 lg:pt-28 pb-10 lg:pb-14 flex flex-col">
        {/* Eyebrow моно */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease }}
          className="font-mono-meta text-[11px] uppercase flex items-center gap-3 flex-wrap"
          style={{ color: "#7a7a8a", letterSpacing: "0.18em" }}
        >
          <span>NEUROMEIN</span>
          <span aria-hidden style={{ color: "#3a3a45" }}>·</span>
          <span>AI Research</span>
          <span aria-hidden style={{ color: "#3a3a45" }}>·</span>
          <span>2026</span>
        </motion.div>

        {/* Display-заголовок */}
        <div className="mt-10 lg:mt-14 max-w-[14ch]">
          <DisplayHeading delay={0.25}>
            Как ИИ перестраивает работу.
          </DisplayHeading>
        </div>

        {/* Подпись справа в духе авторской цитаты */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7, ease }}
          className="mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end"
        >
          <p
            className="text-[15px] sm:text-[16px] leading-[1.65] max-w-[480px]"
            style={{ color: "#9a9aaa" }}
          >
            Аналитика, исследования и проверяемые прогнозы о трансформации
            рынка труда и экономики в горизонте 2026–2030.
          </p>

          <div
            className="font-mono-meta text-[11px] uppercase text-right"
            style={{ color: "#7a7a8a", letterSpacing: "0.16em" }}
          >
            <div style={{ color: "#9a9aaa" }}>Андрей Майнгардт</div>
            <div className="mt-1">AI-стратег</div>
          </div>
        </motion.div>

        {/* Hairline + ticker + CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8, ease }}
          className="mt-10 lg:mt-14"
        >
          <div className="hairline" />

          <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Ticker */}
            <div
              className="font-mono-meta text-[11px] uppercase flex items-center gap-3 flex-wrap"
              style={{ color: "#5a5a6a", letterSpacing: "0.16em" }}
            >
              <span>110 страниц</span>
              <span aria-hidden style={{ color: "#2a2a35" }}>—</span>
              <span>Обновлено март 2026</span>
              <span aria-hidden style={{ color: "#2a2a35" }}>—</span>
              <span style={{ color: "var(--accent-cyan)" }}>5 проверяемых прогнозов</span>
            </div>

            {/* CTA — подчёркнутая ссылка со стрелкой */}
            <div className="flex items-center gap-8">
              <Link
                to="/research"
                className="group inline-flex items-center gap-2 text-[15px] font-medium transition-colors"
                style={{ color: "#f0f0f5" }}
              >
                <span
                  className="relative pb-1"
                  style={{
                    backgroundImage:
                      "linear-gradient(currentColor, currentColor)",
                    backgroundSize: "100% 1px",
                    backgroundPosition: "0 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  Читать исследования
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <a
                href="https://t.me/neuromein"
                target="_blank"
                rel="noreferrer"
                className="text-[14px] transition-colors hover:text-text-primary"
                style={{ color: "#7a7a8a" }}
              >
                Telegram →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

/**
 * Меньшая hero-карточка для внутренних страниц.
 */
export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="relative overflow-hidden rounded-[20px] noise-overlay"
      style={{
        background: "linear-gradient(180deg, #0e0e16 0%, #08080d 100%)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="aurora-bg" aria-hidden />
      <div className="relative z-10 p-8 sm:p-12 lg:p-16">
        {eyebrow && <div className="label-eyebrow mb-6">{eyebrow}</div>}
        <h1
          className="font-display-serif text-text-primary max-w-[16ch]"
          style={{
            fontSize: "clamp(40px, 7vw, 80px)",
            lineHeight: 1.02,
          }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-8 text-[16px] text-text-secondary leading-[1.65] max-w-[560px]">
            {description}
          </p>
        )}
      </div>
    </motion.section>
  );
}

/**
 * 4-колоночный мета-блок Кто/Где/С какого года/Зачем
 */
export function MetaGrid({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-8 mt-10">
      {items.map((it) => (
        <div key={it.label}>
          <div className="label-eyebrow mb-2">{it.label}</div>
          <div className="text-[16px] text-text-primary leading-[1.4]">{it.value}</div>
        </div>
      ))}
    </div>
  );
}
