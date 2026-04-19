import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "./Reveal";

import mguImg from "@/assets/speaking/mgu.jpeg";
import r1Img from "@/assets/speaking/r1.jpeg";
import bankingImg from "@/assets/speaking/banking.jpg";
import armeniaImg from "@/assets/speaking/armenia-bank.jpeg";
import yandexImg from "@/assets/speaking/yandex.jpeg";
import maiImg from "@/assets/speaking/mai.jpeg";

type Item = {
  id: string;
  org: string;
  role: string;
  caption: string;
  image: string;
};

const ITEMS: Item[] = [
  {
    id: "wmt-msu",
    org: "Личный ИИ · WMT AI / МГУ",
    role: "Спикер-эксперт",
    caption: "Обучающий курс по программе Stanford Global Studies",
    image: mguImg,
  },
  {
    id: "r1",
    org: "Проектное бюро R1",
    role: "Спикер-эксперт",
    caption:
      "Воркшоп по интеграции ИИ в бизнес-процессы архитектурного бюро",
    image: r1Img,
  },
  {
    id: "ai-banking",
    org: "ИИ-БАНКИНГ_26",
    role: "Спикер",
    caption:
      "О развитии ИИ в банках в ближайшие годы. Презентация исследования «Тихая замена»",
    image: bankingImg,
  },
  {
    id: "armenia-cb",
    org: "Центральный Банк Армении",
    role: "Спикер-эксперт",
    caption:
      "Двухдневная Executive Program on Applied AI для руководителей ЦБ Армении совместно с WMT AI",
    image: armeniaImg,
  },
  {
    id: "yandex",
    org: "Yandex AI Studio",
    role: "Приглашённый эксперт",
    caption: "Участие в закрытой студийной серии Yandex Cloud",
    image: yandexImg,
  },
  {
    id: "mai",
    org: "Московский Авиационный Институт «МАИ»",
    role: "Спикер-эксперт",
    caption:
      "Обучение администрации вуза стратегиям адаптации образования к эпохе ИИ",
    image: maiImg,
  },
];

export function SpeakingSlider() {
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
          <div
            className="text-[11px] uppercase"
            style={{ color: "#5a5a6a", letterSpacing: "0.06em" }}
          >
            Опыт
          </div>
          <h2
            className="mt-2 text-[26px] lg:text-[30px] font-medium leading-[1.15] tracking-[-0.02em]"
            style={{ color: "#f0f0f5" }}
          >
            Выступления и обучения
          </h2>
          <p
            className="mt-3 text-[15px] leading-[1.6] max-w-[560px]"
            style={{ color: "#9a9aaa" }}
          >
            Лекции, воркшопы и образовательные программы по прикладному ИИ для бизнеса, банков и университетов
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
            className="flex gap-5 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-0 snap-x snap-mandatory scroll-smooth scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {ITEMS.map((item) => (
              <SpeakingCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function SpeakingCard({ item }: { item: Item }) {
  return (
    <article
      data-card
      className="group relative shrink-0 snap-start overflow-hidden flex flex-col"
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
          src={item.image}
          alt={item.org}
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
          {item.org}
        </h3>
        <p
          className="text-[13.5px] leading-[1.55]"
          style={{ color: "#9a9aaa" }}
        >
          {item.caption}
        </p>
      </div>
    </article>
  );
}
