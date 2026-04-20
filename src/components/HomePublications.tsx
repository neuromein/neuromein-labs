import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { PUBLICATIONS, SITE } from "@/lib/site";
import neuromeinAvatar from "@/assets/neuromein-avatar.jpg";

/**
 * Лента публикаций в стиле Telegram-канала.
 * Горизонтальный слайдер с медленной авто-прокруткой в обратную сторону
 * (как «Выступления и обучения», но в другую сторону).
 */
export function HomePublications() {
  const items = PUBLICATIONS;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(true);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  // На монтировании — ставим скролл в конец дублированного списка,
  // чтобы авто-прокрутка шла "влево" (в обратную сторону).
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const half = el.scrollWidth / 2;
    el.scrollLeft = half;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  // Авто-прокрутка влево: непрерывный медленный скролл с бесшовным зацикливанием.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    let paused = false;
    let userInteracting = false;
    let interactionTimer: number | null = null;
    let raf = 0;
    let last = performance.now();
    const SPEED = 18; // px/sec

    const onEnter = () => {
      paused = true;
    };
    const onLeave = () => {
      paused = false;
    };
    const onUserScroll = () => {
      userInteracting = true;
      if (interactionTimer) window.clearTimeout(interactionTimer);
      interactionTimer = window.setTimeout(() => {
        userInteracting = false;
      }, 2500);
    };
    const onVisibility = () => {
      paused = document.hidden;
      last = performance.now();
    };

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      if (!paused && !userInteracting) {
        const half = el.scrollWidth / 2;
        let next = el.scrollLeft - SPEED * dt;
        // бесшовное зацикливание: если ушли в начало — прыгаем на середину
        if (next <= 0) {
          next += half;
        }
        el.scrollLeft = next;
      }
      raf = requestAnimationFrame(tick);
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("touchstart", onEnter, { passive: true });
    el.addEventListener("touchend", onLeave, { passive: true });
    el.addEventListener("wheel", onUserScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (interactionTimer) window.clearTimeout(interactionTimer);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("touchstart", onEnter);
      el.removeEventListener("touchend", onLeave);
      el.removeEventListener("wheel", onUserScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2
            className="text-[26px] lg:text-[30px] font-medium leading-[1.15] tracking-[-0.02em]"
            style={{ color: "#f0f0f5" }}
          >
            Последние публикации
          </h2>
          <p
            className="mt-3 text-[14px] leading-[1.5]"
            style={{ color: "#7a7a8a" }}
          >
            Telegram-канал{" "}
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

        {/* Стрелки навигации */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label="Назад"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className="h-10 w-10 rounded-full inline-flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.04]"
            style={{
              border: "1px solid #2a2a35",
              color: "#f0f0f5",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <ChevronLeft size={18} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Вперёд"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className="h-10 w-10 rounded-full inline-flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.04]"
            style={{
              border: "1px solid #2a2a35",
              color: "#f0f0f5",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <ChevronRight size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <Reveal>
        <div className="relative -mx-4 sm:-mx-6 lg:mx-0">
          {/* Edge fade masks */}
          <div
            aria-hidden
            className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none lg:block hidden"
            style={{
              background: "linear-gradient(to right, #08080D, transparent)",
            }}
          />
          <div
            aria-hidden
            className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none lg:block hidden"
            style={{
              background: "linear-gradient(to left, #08080D, transparent)",
            }}
          />

          <div
            ref={scrollerRef}
            className="flex gap-5 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-0 no-scrollbar"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {[...items, ...items].map((p, idx) => (
              <TelegramPostCard
                key={`${p.slug}-${idx}`}
                title={p.title}
                body={p.body ?? p.excerpt}
                telegramUrl={p.telegramUrl ?? SITE.telegram}
              />
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Карточка поста в стиле Telegram                                    */
/* ------------------------------------------------------------------ */

function TelegramPostCard({
  title,
  body,
  telegramUrl,
}: {
  title: string;
  body: string;
  telegramUrl: string;
}) {
  const COLLAPSED_LIMIT = 220;
  const isLong = body.length > COLLAPSED_LIMIT;
  const displayed = isLong
    ? body.slice(0, COLLAPSED_LIMIT).trimEnd() + "…"
    : body;

  return (
    <article
      data-card
      className="group relative shrink-0 snap-start overflow-hidden flex flex-col"
      style={{
        width: "min(86vw, 360px)",
        background: "#0c0c12",
        border: "1px solid #1c1c28",
        borderRadius: 16,
        transition: "border-color 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(74,158,245,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1c1c28";
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
          className="text-[13.5px] leading-[1.6] whitespace-pre-line"
          style={{ color: "#9a9aaa" }}
        >
          {displayed}
        </p>
      </div>

      {/* Футер: ссылка на TG */}
      <footer
        className="flex items-center justify-end px-5 py-3.5"
        style={{ borderTop: "1px solid #15151e" }}
      >
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
      className="shrink-0 w-10 h-10 rounded-full overflow-hidden"
      style={{
        boxShadow: "0 2px 8px rgba(74, 158, 245, 0.25)",
      }}
      aria-hidden
    >
      <img
        src={neuromeinAvatar}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
      />
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
