import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { InteractiveNeuralBg } from "./InteractiveNeuralBg";
import { HeroNeuralSvg } from "./HeroNeuralSvg";

/**
 * Главная hero-секция:
 * - левая часть: метка, заголовок, описание, кнопки (CTA)
 * - правая часть: анимированная SVG-нейросеть
 * - снизу через горизонтальный разделитель — две карточки исследований
 *
 * Контакты/соцсети убраны (они только в /about и footer).
 * Аватар убран.
 */
export function HeroCard({
  title: _title,
  subtitle: _subtitle,
  socials: _socials = true,
  children,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  socials?: boolean;
  children?: ReactNode;
}) {
  // Helper: easing tuple typed as const for framer-motion
  const ease = [0.22, 1, 0.36, 1] as const;

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
              style={{ color: "#4a4a58", letterSpacing: "0.04em" }}
            >
              Независимый AI-аналитик
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
              style={{ color: "#888898" }}
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
                  color: "#888898",
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

        {/* BOTTOM: research preview cards */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease }}
          className="mt-12 pt-8 grid grid-cols-1 md:grid-cols-2 gap-4 pointer-events-auto"
          style={{ borderTop: "1px solid #14141c" }}
        >
          <ResearchPreviewCard
            to="/research/$slug"
            slug="silent-replacement"
            dotColor="#4A9EF5"
            tag="ИССЛЕДОВАНИЕ"
            title="Тихая замена"
            description="Как ИИ-автоматизация незаметно замещает рабочие функции — и почему это важнее, чем массовые увольнения"
          />
          <ResearchPreviewCard
            to="/research/$slug"
            slug="ai-2025-forecast"
            dotColor="#7AB8F5"
            tag="ОТЧЁТ"
            title="ИИ в 2025 и прогнозы на 2026"
            description="Полный анализ ключевых трендов искусственного интеллекта и проверяемые прогнозы на ближайший год"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}

function ResearchPreviewCard({
  slug,
  dotColor,
  tag,
  title,
  description,
}: {
  to: "/research/$slug";
  slug: string;
  dotColor: string;
  tag: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      to="/research/$slug"
      params={{ slug }}
      className="group block rounded-[10px] p-5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
      style={{
        background: "transparent",
        border: "1px solid #1c1c28",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#3a3a48";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1c1c28";
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="inline-block"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: dotColor,
          }}
        />
        <span
          className="text-[11px] uppercase"
          style={{ color: "#4a4a58", letterSpacing: "0.05em" }}
        >
          {tag}
        </span>
      </div>
      <h3
        className="mt-3 text-[16px] font-medium leading-[1.3]"
        style={{ color: "#dddde5" }}
      >
        {title}
      </h3>
      <p
        className="mt-2 text-[13px] leading-[1.5]"
        style={{ color: "#7a7a8a" }}
      >
        {description}
      </p>
    </Link>
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
