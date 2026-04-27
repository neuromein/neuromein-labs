import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import type { SpeakingEngagement } from "@/data/speaking.fetch";
import { fetchSpeaking } from "@/data/speaking.fetch";

export function SpeakingSlider({ items: itemsProp }: { items?: SpeakingEngagement[] }) {
  const [items, setItems] = useState<SpeakingEngagement[]>(itemsProp ?? []);

  useEffect(() => {
    if (itemsProp && itemsProp.length > 0) return;
    let cancelled = false;
    fetchSpeaking()
      .then((rows) => {
        if (!cancelled) setItems(rows);
      })
      .catch(() => {
        /* fail silently — section just stays empty */
      });
    return () => {
      cancelled = true;
    };
  }, [itemsProp]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateButtons();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [items.length]);

  // Авто-прокрутка: медленный непрерывный скролл с бесшовным зацикливанием.
  // Пауза при наведении, тач-взаимодействии или скрытой вкладке.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || items.length === 0) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    let paused = false;
    let userInteracting = false;
    let interactionTimer: number | null = null;
    let raf = 0;
    let last = performance.now();
    const SPEED = 18; // пикселей в секунду — медленно и плавно

    const onEnter = () => {
      paused = true;
    };
    const onLeave = () => {
      paused = false;
    };
    const onUserScroll = () => {
      // если пользователь сам скроллит — приостанавливаем на 2.5с
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
        let next = el.scrollLeft + SPEED * dt;
        // бесшовное зацикливание: после прохождения половины (дубль) откатываем
        if (next >= half) {
          next -= half;
          el.scrollLeft = next;
        } else {
          el.scrollLeft = next;
        }
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
  }, [items.length]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2
            className="text-[26px] lg:text-[30px] font-medium leading-[1.15] tracking-[-0.02em]"
            style={{ color: "#f0f0f5" }}
          >
            Выступления и обучения
          </h2>
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
              background:
                "linear-gradient(to right, #08080D, transparent)",
            }}
          />
          <div
            aria-hidden
            className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none lg:block hidden"
            style={{
              background:
                "linear-gradient(to left, #08080D, transparent)",
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
            {/* Дублируем список для бесшовного зацикливания авто-прокрутки */}
            {[...items, ...items].map((item, idx) => (
              <SpeakingCard key={`${item.id}-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function SpeakingCard({ item }: { item: SpeakingEngagement }) {
  return (
    <Link
      to="/speaking/$slug"
      params={{ slug: item.slug }}
      data-card
      className="group relative shrink-0 snap-start overflow-hidden flex flex-col cursor-pointer"
      style={{
        width: "min(86vw, 360px)",
        background: "#0c0c12",
        border: "1px solid #1c1c28",
        borderRadius: 16,
        transition: "border-color 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(74,158,245,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1c1c28";
      }}
    >
      {/* Image — 4:3 */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "4 / 3", background: "#0a0a10" }}
      >
        <img
          src={item.imageUrl}
          alt={item.organization}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {/* Subtle bottom gradient for depth */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(12,12,18,0.85), transparent)",
          }}
        />
        {/* Liquid glass role chip */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center h-7 px-3 rounded-full text-[11px] font-medium backdrop-blur-md"
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#f0f0f5",
              letterSpacing: "0.01em",
            }}
          >
            {item.role}
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-3 p-5 lg:p-6 flex-grow">
        <h3
          className="text-[17px] lg:text-[18px] font-medium leading-[1.25] tracking-[-0.01em]"
          style={{ color: "#f0f0f5" }}
        >
          {item.organization}
        </h3>
        <p
          className="text-[13.5px] leading-[1.55]"
          style={{ color: "#9a9aaa" }}
        >
          {item.caption}
        </p>
      </div>
    </Link>
  );
}
