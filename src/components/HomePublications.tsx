import { useState } from "react";
import { Reveal } from "./Reveal";
import { PUBLICATIONS, SITE } from "@/lib/site";

/**
 * Лента публикаций в стиле Telegram-канала.
 * Карточки оформлены как посты в TG: шапка канала, дата, текст, реакции/CTA.
 */
export function HomePublications() {
  const items = PUBLICATIONS.slice(0, 4);

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2
            className="mt-2 text-[26px] lg:text-[30px] font-medium leading-[1.15] tracking-[-0.02em]"
            style={{ color: "#f0f0f5" }}
          >
            Последние публикации
          </h2>
          <p
            className="mt-3 text-[14px] leading-[1.5]"
            style={{ color: "#7a7a8a" }}
          >
            Прямо из Telegram-канала{" "}
            <a
              href={SITE.telegram}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 transition-colors hover:text-[#4A9EF5]"
              style={{ color: "#9a9aaa" }}
            >
              @neuromein
            </a>
          </p>
        </div>

        <a
          href={SITE.telegram}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-2 h-[40px] px-4 rounded-[10px] text-[13px] font-medium transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
          style={{
            background: "rgba(74, 158, 245, 0.08)",
            color: "#4A9EF5",
            border: "1px solid rgba(74, 158, 245, 0.2)",
          }}
        >
          <TelegramIcon />
          Открыть канал
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.06}>
            <TelegramPostCard
              title={p.title}
              body={p.body ?? p.excerpt}
              dateLabel={p.dateLabel}
              telegramUrl={p.telegramUrl ?? SITE.telegram}
              tag={p.tag}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Карточка поста в стиле Telegram                                    */
/* ------------------------------------------------------------------ */

function TelegramPostCard({
  title,
  body,
  dateLabel,
  telegramUrl,
  tag,
}: {
  title: string;
  body: string;
  dateLabel: string;
  telegramUrl: string;
  tag: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const COLLAPSED_LIMIT = 380;
  const isLong = body.length > COLLAPSED_LIMIT;
  const displayed =
    expanded || !isLong ? body : body.slice(0, COLLAPSED_LIMIT).trimEnd() + "…";

  return (
    <article
      className="relative flex flex-col h-full rounded-[16px] overflow-hidden transition-all duration-300 hover:border-[#2a2a38]"
      style={{
        background: "#0c0c12",
        border: "1px solid #1c1c28",
      }}
    >
      {/* Шапка канала */}
      <header
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: "1px solid #15151e" }}
      >
        <ChannelAvatar />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="text-[14px] font-medium truncate"
              style={{ color: "#f0f0f5" }}
            >
              NEUROMEIN
            </span>
            <VerifiedBadge />
          </div>
          <span
            className="text-[12px] block truncate"
            style={{ color: "#7a7a8a" }}
          >
            @neuromein
          </span>
        </div>
        <span
          className="shrink-0 inline-flex items-center h-[24px] px-2.5 rounded-full text-[11px] uppercase tracking-[0.04em]"
          style={{
            background: "rgba(74, 158, 245, 0.08)",
            color: "#4A9EF5",
          }}
        >
          {tag}
        </span>
      </header>

      {/* Тело поста */}
      <div className="flex-1 px-5 py-4">
        <h3
          className="text-[16px] lg:text-[17px] font-medium leading-[1.35] tracking-[-0.01em] mb-3"
          style={{ color: "#f0f0f5" }}
        >
          {title}
        </h3>
        <p
          className="text-[14px] leading-[1.6] whitespace-pre-line"
          style={{ color: "#9a9aaa" }}
        >
          {displayed}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 text-[13px] font-medium transition-colors hover:text-[#7eb8f8]"
            style={{ color: "#4A9EF5" }}
          >
            {expanded ? "Свернуть" : "Показать полностью"}
          </button>
        )}
      </div>

      {/* Футер: дата + ссылка на TG */}
      <footer
        className="flex items-center justify-between gap-3 px-5 py-3.5"
        style={{ borderTop: "1px solid #15151e" }}
      >
        <span
          className="inline-flex items-center gap-1.5 text-[12px]"
          style={{ color: "#7a7a8a" }}
        >
          <ClockIcon />
          {dateLabel}
        </span>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors hover:text-[#7eb8f8]"
          style={{ color: "#4A9EF5" }}
        >
          Читать в Telegram
          <ArrowIcon />
        </a>
      </footer>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Аватарка канала и иконки                                          */
/* ------------------------------------------------------------------ */

function ChannelAvatar() {
  return (
    <div
      className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold"
      style={{
        background: "linear-gradient(135deg, #4A9EF5 0%, #2D7AD4 100%)",
        color: "#08080D",
        boxShadow: "0 2px 8px rgba(74, 158, 245, 0.25)",
      }}
      aria-hidden
    >
      N
    </div>
  );
}

function VerifiedBadge() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M7 0.5l1.5 1.4 2-0.2 0.6 1.9 1.9 0.6-0.2 2L14 7.5l-1.4 1.5 0.2 2-1.9 0.6-0.6 1.9-2-0.2L7 14.5l-1.5-1.4-2 0.2-0.6-1.9-1.9-0.6 0.2-2L0 7.5l1.4-1.5-0.2-2 1.9-0.6 0.6-1.9 2 0.2L7 0.5z"
        fill="#4A9EF5"
      />
      <path
        d="M4.5 7.5l1.7 1.7L9.5 5.8"
        stroke="#08080D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
      <path
        d="M6 3v3l2 1.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M3.5 8.5L8.5 3.5M8.5 3.5H4M8.5 3.5V8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.86 8.78c-.14.62-.51.77-1.03.48l-2.85-2.1-1.37 1.32c-.15.15-.28.28-.57.28l.2-2.91 5.31-4.8c.23-.2-.05-.31-.36-.11l-6.56 4.13-2.83-.88c-.62-.19-.63-.62.13-.92l11.05-4.26c.51-.19.96.12.79.92z" />
    </svg>
  );
}
