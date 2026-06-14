import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { InteractiveNeuralBg } from "./InteractiveNeuralBg";
import { PaperShaderBg } from "./PaperShaderBg";
import { SITE } from "@/lib/site";
import avatarUrl from "@/assets/avatar.jpg";

/**
 * Hero-секция:
 * - без `title` (главная) – две колонки: лево copy+CTA, право – SVG-нейросеть, снизу карточки исследований
 * - с `title` (страницы типа /about) – заголовок-имя 36px, подзаголовок 18px, дети (MetaGrid и т.п.)
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

  // Default home hero – фото слева, имя + описание + контакты справа
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease }}
      className="relative overflow-hidden min-h-[88vh] flex items-center"
    >
      <PaperShaderBg />

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-14 pointer-events-auto">
        <div className="max-w-[620px]">
        {/* Avatar + Name row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease }}
          className="flex items-center gap-3.5"
        >
          {/* Avatar */}
          <div
            className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-[14px] overflow-hidden shrink-0"
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow:
                "0 8px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <img
              src={avatarUrl}
              alt="Андрей Майнгардт"
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              width={64}
              height={64}
            />
          </div>

          {/* Name */}
          <div
            style={{
              color: "rgba(255,255,255,0.70)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              lineHeight: 1.2,
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            Андрей Майнгардт
          </div>
        </motion.div>

        {/* H1 – main positioning */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease }}
          style={{
            marginTop: 20,
            fontSize: "clamp(2.25rem, 3.6vw, 3.25rem)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            color: "#f0f0f5",
            maxWidth: 860,
            textWrap: "balance",
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          Эксперт по влиянию ИИ на бизнес-процессы и рынок труда
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.6, ease }}
          style={{
            marginTop: 24,
            maxWidth: 680,
            fontSize: 21,
            lineHeight: 1.4,
            fontWeight: 400,
            color: "rgba(255,255,255,0.80)",
            textWrap: "balance",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Исследую и показываю, к чему готовиться бизнесу и людям
        </motion.p>

        {/* Role */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.6, ease }}
          style={{ marginTop: 28 }}
        >
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", fontFamily: "'Inter', sans-serif" }}>
            Автор исследования «Тихая замена»
            <span style={{ color: "var(--primary)", margin: "0 0.5em" }}>·</span>
            Director of Strategy, WMT AI
          </div>
        </motion.div>

        {/* Email + socials */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.6, ease }}
          className="flex flex-wrap items-center gap-2.5"
          style={{ marginTop: 32 }}
        >
          <SocialIconLink href={SITE.telegram} label="Telegram">
            <TelegramIcon />
          </SocialIconLink>
          <SocialIconLink href={SITE.linkedin} label="LinkedIn">
            <LinkedInIcon />
          </SocialIconLink>
          <SocialIconLink href={`mailto:${SITE.email}`} label={SITE.email}>
            <MailIcon />
          </SocialIconLink>
        </motion.div>

        {children}
        </div>
      </div>
    </motion.section>
  );
}

function SocialIconWrap({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center justify-center h-7 w-7 rounded-full"
      style={{ background: "rgba(255,255,255,0.06)", color: "#e0e0e8" }}
    >
      {children}
    </span>
  );
}

function SocialIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center h-11 w-11 rounded-full transition-colors hover:opacity-90"
      style={{
        background: "rgba(20,20,28,0.7)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#e0e0e8",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {children}
    </a>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 4.5L8 9L13.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.5 4.2 2.7 11.4c-1 .4-1 1 .1 1.3l4.7 1.5 1.8 5.7c.2.6.5.7 1 .3l2.7-2.4 4.8 3.6c.9.5 1.5.2 1.7-.8L22.8 5.4c.3-1.2-.4-1.7-1.3-1.2zM9.6 14.7l-.4 4 .9-3.6 8.7-7.8c.4-.4-.1-.6-.6-.3L8.6 13.3z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.5 0H12v1.93h.06c.6-1.13 2.07-2.32 4.27-2.32 4.57 0 5.42 3 5.42 6.9V22h-4.56v-6.34c0-1.51-.03-3.46-2.11-3.46-2.11 0-2.43 1.65-2.43 3.35V22H7.72V8z" />
    </svg>
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
