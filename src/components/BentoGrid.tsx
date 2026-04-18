import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { RESEARCH, PREDICTIONS, PUBLICATIONS, SITE } from "@/lib/site";

/**
 * Bento-grid главной страницы:
 * Ряд 1 — две карточки исследований (1fr 1fr)
 * Ряд 2 — превью прогнозов (2fr) + блок «О проекте» (1fr)
 * Ряд 3 — карточка с последними публикациями (full width)
 *
 * На мобильных всё схлопывается в одну колонку.
 */
export function BentoGrid() {
  const research = RESEARCH;
  const previewPredictions = PREDICTIONS.slice(0, 2);
  const publications = PUBLICATIONS.slice(0, 4);

  return (
    <div className="mt-8 flex flex-col gap-4">
      {/* Row 1 — research cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {research.map((r, i) => (
          <Reveal key={r.slug} delay={i * 0.1}>
            <BentoCard>
              <Link
                to="/research/$slug"
                params={{ slug: r.slug }}
                className="block group h-full"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: r.dotColor }}
                  />
                  <span
                    className="text-[11px] uppercase"
                    style={{ color: "#5a5a6a", letterSpacing: "0.06em" }}
                  >
                    {r.eyebrow} · {r.year}
                  </span>
                </div>
                <h3
                  className="mt-5 text-[24px] lg:text-[26px] font-medium leading-[1.15] tracking-[-0.02em]"
                  style={{ color: "#f0f0f5" }}
                >
                  {r.title}
                </h3>
                <p
                  className="mt-3 text-[14px] leading-[1.55] max-w-[44ch]"
                  style={{ color: "#9a9aaa" }}
                >
                  {r.short}
                </p>
                <div
                  className="mt-6 flex items-center gap-2 text-[12px]"
                  style={{ color: "#7a7a8a" }}
                >
                  <span>{r.date}</span>
                  <span>·</span>
                  <span>{r.readTime}</span>
                </div>
              </Link>
            </BentoCard>
          </Reveal>
        ))}
      </div>

      {/* Row 2 — predictions preview + about */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Reveal delay={0}>
          <div className="md:col-span-2 h-full">
            <BentoCard>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className="text-[11px] uppercase"
                    style={{ color: "#5a5a6a", letterSpacing: "0.06em" }}
                  >
                    Прогнозы
                  </div>
                  <h3
                    className="mt-2 text-[22px] lg:text-[24px] font-medium leading-[1.2] tracking-[-0.02em]"
                    style={{ color: "#f0f0f5" }}
                  >
                    Прогнозы и их проверка
                  </h3>
                </div>
              </div>

              <ul className="mt-5 flex flex-col gap-3">
                {previewPredictions.map((p) => (
                  <li
                    key={p.id}
                    className="flex gap-3 items-start py-3"
                    style={{ borderTop: "1px solid #1c1c28" }}
                  >
                    <StatusBadge status={p.status} />
                    <p
                      className="text-[13px] leading-[1.5] flex-1"
                      style={{ color: "#bdbdc8" }}
                    >
                      {p.statement}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                <Link
                  to="/predictions"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
                  style={{ color: "#4A9EF5" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#6AB4FF";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#4A9EF5";
                  }}
                >
                  Все прогнозы →
                </Link>
              </div>
            </BentoCard>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full">
            <BentoCard>
              <div
                className="text-[11px] uppercase"
                style={{ color: "#5a5a6a", letterSpacing: "0.06em" }}
              >
                О проекте
              </div>
              <h3
                className="mt-2 text-[22px] lg:text-[24px] font-medium leading-[1.2] tracking-[-0.02em]"
                style={{ color: "#f0f0f5" }}
              >
                NEUROMEIN
              </h3>
              <p
                className="mt-4 text-[13px] leading-[1.6]"
                style={{ color: "#9a9aaa" }}
              >
                Независимый аналитический ресурс об ИИ и рынке труда. 43 000+
                подписчиков.
              </p>

              <div className="mt-6">
                <a
                  href={SITE.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
                  style={{ color: "#4A9EF5" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#6AB4FF";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#4A9EF5";
                  }}
                >
                  Telegram-канал →
                </a>
              </div>
            </BentoCard>
          </div>
        </Reveal>
      </div>

      {/* Row 3 — publications full width */}
      <Reveal delay={0}>
        <BentoCard>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <div
                className="text-[11px] uppercase"
                style={{ color: "#5a5a6a", letterSpacing: "0.06em" }}
              >
                Заметки
              </div>
              <h3
                className="mt-2 text-[22px] lg:text-[24px] font-medium leading-[1.2] tracking-[-0.02em]"
                style={{ color: "#f0f0f5" }}
              >
                Последние публикации
              </h3>
            </div>
            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center text-[13px] transition-colors"
              style={{ color: "#9a9aaa" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#f0f0f5";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#9a9aaa";
              }}
            >
              Все публикации →
            </Link>
          </div>

          <ul className="flex flex-col">
            {publications.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-4"
                  style={{ borderTop: "1px solid #1c1c28" }}
                >
                  <span
                    className="text-[12px] tabular-nums shrink-0 w-[140px] tracking-wide uppercase"
                    style={{ color: "#7a7a8a" }}
                  >
                    {p.dateLabel}
                  </span>
                  <span
                    className="flex-1 min-w-0 text-[15px] leading-[1.4] tracking-[-0.005em] transition-colors"
                    style={{ color: "#dddde5" }}
                  >
                    {p.title}
                  </span>
                  <span
                    className="inline-flex items-center h-6 px-2.5 rounded-full text-[10px] uppercase shrink-0"
                    style={{
                      border: "1px solid #2a2a35",
                      color: "#9a9aaa",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {p.tag}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </BentoCard>
      </Reveal>
    </div>
  );
}

function BentoCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="h-full cursor-pointer"
      style={{
        background: "#111118",
        border: "1px solid #1c1c28",
        borderRadius: 12,
        padding: "24px 28px",
        transition: "border-color 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#3a3a48";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#1c1c28";
      }}
    >
      {children}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: "confirmed" | "partial" | "in_progress" | "not_confirmed" }) {
  const map: Record<string, { label: string; bg: string; fg: string; border: string }> = {
    confirmed: {
      label: "Подтверждён",
      bg: "rgba(74, 232, 140, 0.10)",
      fg: "#4AE88C",
      border: "rgba(74, 232, 140, 0.25)",
    },
    partial: {
      label: "Частично",
      bg: "rgba(232, 200, 74, 0.10)",
      fg: "#E8C84A",
      border: "rgba(232, 200, 74, 0.25)",
    },
    in_progress: {
      label: "В процессе",
      bg: "rgba(74, 158, 245, 0.10)",
      fg: "#4A9EF5",
      border: "rgba(74, 158, 245, 0.25)",
    },
    not_confirmed: {
      label: "Не подтв.",
      bg: "rgba(232, 74, 74, 0.10)",
      fg: "#E84A4A",
      border: "rgba(232, 74, 74, 0.25)",
    },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center h-6 px-2.5 rounded-full text-[10px] uppercase shrink-0 mt-0.5"
      style={{
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.border}`,
        letterSpacing: "0.05em",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}
