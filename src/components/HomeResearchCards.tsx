import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { RESEARCH } from "@/lib/site";

/**
 * Две богатые карточки исследований под hero на главной.
 * Без цветных «точек» — только лаконичная типографика и обложка работы.
 */
export function HomeResearchCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {RESEARCH.map((r, i) => (
        <Reveal key={r.slug} delay={i * 0.1}>
          <ResearchCard
            slug={r.slug}
            eyebrow={r.eyebrow}
            year={r.year}
            title={r.title}
            short={r.short}
            date={r.date}
            cover={r.cover}
          />
        </Reveal>
      ))}
    </div>
  );
}

function ResearchCard({
  slug,
  eyebrow,
  year,
  title,
  short,
  date,
  cover,
}: {
  slug: string;
  eyebrow: string;
  year: string;
  title: string;
  short: string;
  date: string;
  cover: string;
}) {
  return (
    <Link
      to="/research/$slug"
      params={{ slug }}
      className="block h-full cursor-pointer"
    >
      <motion.article
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden h-full flex flex-col"
        style={{
          minHeight: 280,
          background: "#0c0c12",
          border: "1px solid #1c1c28",
          borderRadius: 12,
          padding: "28px 30px",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "rgba(74,158,245,0.3)";
          el.style.boxShadow = "0 4px 24px rgba(74,158,245,0.08)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "#1c1c28";
          el.style.boxShadow = "none";
        }}
      >
        {/* Тонкий голубой градиент сверху */}
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: "40%",
            background:
              "linear-gradient(to bottom, rgba(74,158,245,0.06), transparent)",
          }}
        />

        <div className="relative flex items-start gap-5">
          {/* Миниатюра обложки */}
          <div
            className="shrink-0 overflow-hidden rounded-md"
            style={{
              width: 64,
              height: 88,
              border: "1px solid #1c1c28",
              background: "#0a0a10",
            }}
          >
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span
              className="text-[11px] uppercase"
              style={{ color: "#5a5a6a", letterSpacing: "0.06em" }}
            >
              {year ? `${eyebrow} · ${year}` : eyebrow}
            </span>
            <h3
              className="mt-3 text-[24px] lg:text-[26px] font-medium leading-[1.15] tracking-[-0.02em]"
              style={{ color: "#f0f0f5" }}
            >
              {title}
            </h3>
          </div>
        </div>

        <p
          className="relative mt-5 text-[14px] leading-[1.55] max-w-[44ch] flex-grow"
          style={{ color: "#9a9aaa" }}
        >
          {short}
        </p>

        <div className="relative mt-6 flex items-center justify-between gap-4">
          <span className="text-[12px]" style={{ color: "#7a7a8a" }}>
            {date}
          </span>
          <span
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-medium"
            style={{
              border: "1px solid #2a2a35",
              color: "#f0f0f5",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            Читать →
          </span>
        </div>
      </motion.article>
    </Link>
  );
}
