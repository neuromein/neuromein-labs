import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { SITE } from "@/lib/site";
import { InteractiveNeuralBg } from "./InteractiveNeuralBg";
import avatarUrl from "@/assets/avatar.jpg";

/**
 * Большая hero-карточка в стиле Madiyour:
 * - rounded-2xl, тёмный фон
 * - голубое свечение и градиент-сферы
 * - аватар-плейсхолдер слева
 * - крупный заголовок и подзаголовок
 * - ряд квадратных pill-кнопок соцсетей
 */
export function HeroCard({
  title,
  subtitle,
  socials = true,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  socials?: boolean;
  children?: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[28px] border-[0.5px] border-border bg-bg-deep"
    >
      {/* Interactive neural network background */}
      <InteractiveNeuralBg />

      <div className="relative z-10 p-7 sm:p-10 lg:p-14 min-h-[560px] flex flex-col justify-between gap-12 pointer-events-none">
        <div>
          {/* Avatar placeholder */}
          <div className="h-[88px] w-[88px] rounded-2xl bg-bg-card/70 backdrop-blur-md border-[0.5px] border-border-strong flex items-center justify-center text-text-tertiary">
            <AvatarPlaceholderIcon />
          </div>

          {/* Title */}
          <h1 className="mt-10 text-[36px] sm:text-[52px] lg:text-[64px] font-medium text-text-primary leading-[1.05] tracking-[-0.02em] max-w-[18ch]">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-6 text-[14px] sm:text-[15px] text-text-secondary leading-[1.55] max-w-[520px]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-6">
          {children}
          {socials && <SocialRow />}
        </div>
      </div>
    </motion.section>
  );
}

function GlowBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {/* Top-right blue sphere */}
      <div
        className="absolute -top-32 -right-24 w-[640px] h-[640px] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.68 0.14 250 / 0.55) 0%, oklch(0.68 0.14 250 / 0.18) 35%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      {/* Bottom-right teal sweep */}
      <div
        className="absolute -bottom-40 right-10 w-[720px] h-[420px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.65 0.12 220 / 0.45) 0%, oklch(0.5 0.10 230 / 0.15) 50%, transparent 80%)",
          filter: "blur(60px)",
        }}
      />
      {/* Soft top-left tint */}
      <div
        className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.55 0.16 255 / 0.4) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />
      {/* Curved line accent */}
      <svg
        className="absolute -bottom-10 right-[-10%] w-[110%] opacity-50 mix-blend-screen"
        viewBox="0 0 1200 400"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M-50 350 Q 400 50, 800 200 T 1300 100"
          stroke="url(#heroLine)"
          strokeWidth="1.5"
          fill="none"
        />
        <defs>
          <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.68 0.14 250 / 0)" />
            <stop offset="50%" stopColor="oklch(0.78 0.15 240 / 0.8)" />
            <stop offset="100%" stopColor="oklch(0.68 0.14 250 / 0)" />
          </linearGradient>
        </defs>
      </svg>
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/60 via-transparent to-transparent" />
    </div>
  );
}

function AvatarPlaceholderIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SocialRow() {
  const items: { label: string; href: string; icon: ReactNode }[] = [
    {
      label: "Email",
      href: `mailto:${SITE.email}`,
      icon: (
        <span className="flex items-center gap-2">
          <MailIcon />
          <span className="text-[12px] text-text-secondary hidden sm:inline">{SITE.email}</span>
        </span>
      ),
    },
    { label: "Telegram", href: SITE.telegram, icon: <TelegramIcon /> },
    { label: "LinkedIn", href: SITE.linkedin, icon: <LinkedinIcon /> },
  ];
  return (
    <div className="flex items-center flex-wrap gap-2 pointer-events-auto">
      {items.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target={s.href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          aria-label={s.label}
          className="flex items-center gap-2 h-11 px-3 rounded-xl border-[0.5px] border-border-strong bg-bg-card/60 backdrop-blur-md text-text-primary hover:bg-bg-card transition-colors"
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M21 4L3 11l6 2 2 6 4-4 5 4 1-15z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4M11 10v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Меньшая hero-карточка для внутренних страниц (исследования, блог, FAQ и т.д.)
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
 * 4-колоночный мета-блок Кто/Где/С какого года/Зачем (как у Madiyour)
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
          <div className="text-[12px] text-text-tertiary mb-2">{it.label}</div>
          <div className="text-[15px] text-text-primary leading-[1.4]">{it.value}</div>
        </div>
      ))}
    </div>
  );
}
