import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { InteractiveNeuralBg } from "./InteractiveNeuralBg";
import { HeroNeuralSvg } from "./HeroNeuralSvg";

/**
 * Hero-секция:
 * - без `title` (главная) — две колонки: лево copy+CTA, право — SVG-нейросеть, снизу карточки исследований
 * - с `title` (страницы типа /about) — заголовок-имя 36px, подзаголовок 18px, дети (MetaGrid и т.п.)
 *
 * Контакты/соцсети убраны (они только в /about и footer).
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
  const ease = [0.22, 1, 0.36, 1] as const;

  // Variant for internal pages (about, etc.)
  if (title) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="relative overflow-hidden rounded-[28px] border-[0.5px] border-border bg-bg-deep"
      >
        <InteractiveNeuralBg />

        <div className="relative z-10 p-7 sm:p-10 lg:p-14 pointer-events-auto">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease }}
            className="font-medium tracking-[-0.02em] max-w-[20ch]"
            style={{
              fontSize: "clamp(28px, 4.5vw, 36px)",
              lineHeight: 1.15,
              color: "#f0f0f5",
              hyphens: "none",
              wordBreak: "keep-all",
              overflowWrap: "normal",
            }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease }}
              className="mt-5 leading-[1.55] max-w-[640px]"
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: "#9a9aaa",
                hyphens: "none",
                wordBreak: "keep-all",
                overflowWrap: "normal",
              }}
            >
              {subtitle}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </motion.section>
    );
  }

  // Default home hero
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease }}
      className="relative overflow-hidden rounded-[28px] border-[0.5px] border-border bg-bg-deep"
    >
      <InteractiveNeuralBg />

      <div className="relative z-10 p-7 sm:p-10 lg:p-14">
        {/* TOP: two-column hero */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-10 lg:gap-12 items-center min-h-[460px]">
          {/* LEFT: copy + CTA */}
          <div className="pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease }}
              className="text-[13px] uppercase mb-4"
              style={{ color: "#7a7a8a", letterSpacing: "0.04em" }}
            >
              AI-стратег · Аналитик · Основатель NEUROMEIN
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.7, ease }}
              className="text-[34px] sm:text-[40px] lg:text-[44px] font-medium leading-[1.18] tracking-[-0.02em] max-w-[560px]"
              style={{ color: "#f0f0f5" }}
            >
              Как ИИ перестраивает работу, профессии и экономику
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6, ease }}
              className="mt-5 text-[15px] leading-[1.65] max-w-[460px]"
              style={{ color: "#9a9aaa" }}
            >
              Исследую трансформацию рынка труда в горизонте 2026–2030.
              Пишу аналитику, делаю проверяемые прогнозы, разбираю последствия
              для бизнеса и специалистов.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/research"
                className="inline-flex items-center h-[44px] px-6 rounded-[8px] text-[14px] font-medium transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
                style={{ background: "#f0f0f5", color: "#08080D" }}
              >
                Читать исследования
              </Link>
              <a
                href="https://t.me/neuromein"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center h-[44px] px-6 rounded-[8px] text-[14px] border transition-all duration-200 hover:text-text-primary hover:opacity-85 active:scale-[0.98]"
                style={{
                  borderColor: "#2a2a35",
                  color: "#9a9aaa",
                  background: "transparent",
                }}
              >
                Telegram-канал
              </a>
            </motion.div>

            {children}
          </div>

          {/* RIGHT: animated neural SVG */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.5, ease }}
            className="relative h-[280px] sm:h-[360px] lg:h-[420px] w-full pointer-events-none"
          >
            <HeroNeuralSvg />
          </motion.div>
        </div>
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
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[28px] border-[0.5px] border-border bg-bg-deep"
    >
      <InteractiveNeuralBg />
      <div className="relative z-10 p-8 sm:p-12 lg:p-16">
        {eyebrow && <div className="label-eyebrow mb-5">{eyebrow}</div>}
        <h1 className="text-[40px] sm:text-[56px] lg:text-[72px] font-medium text-text-primary leading-[1.02] tracking-[-0.025em] max-w-[16ch]">
          {title}
        </h1>
        {description && (
          <p className="mt-8 text-[15px] text-text-secondary leading-[1.6] max-w-[560px]">
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
          <div className="text-[13px] text-text-tertiary mb-2">{it.label}</div>
          <div className="text-[16px] text-text-primary leading-[1.4]">{it.value}</div>
        </div>
      ))}
    </div>
  );
}
