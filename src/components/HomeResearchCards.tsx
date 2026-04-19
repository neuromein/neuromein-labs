import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { RESEARCH } from "@/lib/site";

/**
 * «Киноплакаты» исследований: крупная обложка слева,
 * типографика справа, hover — лёгкое масштабирование обложки и glow.
 */
export function HomeResearchCards() {
  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-10">
        <div>
          <div className="label-eyebrow">Исследования</div>
          <h2
            className="font-display-serif mt-3"
            style={{
              fontSize: "clamp(32px, 4.5vw, 52px)",
              lineHeight: 1.05,
              color: "#f0f0f5",
            }}
          >
            Длинные тексты <span style={{ color: "#5a5a6a" }}>·</span>{" "}
            <span style={{ fontStyle: "italic", color: "var(--accent-cyan)" }}>
              открытый PDF
            </span>
          </h2>
        </div>
        <Link
          to="/research"
          className="hidden sm:inline-flex items-center gap-2 text-[14px] transition-colors hover:text-text-primary"
          style={{ color: "#7a7a8a" }}
        >
          Все материалы →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {RESEARCH.map((r, i) => (
          <Reveal key={r.slug} delay={i * 0.08}>
            <ResearchPoster
              slug={r.slug}
              eyebrow={r.eyebrow}
              year={r.year}
              title={r.title}
              short={r.short}
              date={r.date}
              cover={r.cover}
              pages={r.pages}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function ResearchPoster({
  slug,
  eyebrow,
  year,
  title,
  short,
  date,
  cover,
  pages,
}: {
  slug: string;
  eyebrow: string;
  year: string;
  title: string;
  short: string;
  date: string;
  cover: string;
  pages: number;
}) {
  return (
    <Link
      to="/research/$slug"
      params={{ slug }}
      className="block h-full group"
    >
      <motion.article
        whileHover={{ y: -3 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden h-full"
        style={{
          minHeight: 380,
          background: "linear-gradient(180deg, #0e0e16 0%, #08080d 100%)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 20,
          padding: 28,
          transition: "border-color 0.4s ease, box-shadow 0.4s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "rgba(74,158,245,0.35)";
          el.style.boxShadow = "0 24px 80px -20px rgba(74,158,245,0.18)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "rgba(255,255,255,0.05)";
          el.style.boxShadow = "none";
        }}
      >
        <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-7 h-full">
          {/* Обложка как герой */}
          <div className="relative">
            <motion.div
              className="overflow-hidden rounded-[10px]"
              style={{
                aspectRatio: "2 / 3",
                background: "#0a0a10",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)",
              }}
              whileHover={{ scale: 1.025 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={cover}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>

          {/* Контент */}
          <div className="flex flex-col h-full min-w-0">
            <div
              className="font-mono-meta text-[10px] uppercase flex items-center gap-2"
              style={{ color: "#5a5a6a", letterSpacing: "0.16em" }}
            >
              <span>{eyebrow}</span>
              <span aria-hidden style={{ color: "#2a2a35" }}>·</span>
              <span>{year}</span>
            </div>

            <h3
              className="font-display-serif mt-4"
              style={{
                fontSize: "clamp(28px, 3vw, 36px)",
                lineHeight: 1.05,
                color: "#f0f0f5",
              }}
            >
              {title}
            </h3>

            <p
              className="mt-4 text-[14px] leading-[1.6] flex-grow"
              style={{ color: "#9a9aaa" }}
            >
              {short}
            </p>

            {/* Hairline + meta + arrow */}
            <div className="mt-6">
              <div
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)",
                }}
              />
              <div className="mt-4 flex items-center justify-between gap-4">
                <div
                  className="font-mono-meta text-[11px] uppercase flex items-center gap-2 flex-wrap"
                  style={{ color: "#5a5a6a", letterSpacing: "0.12em" }}
                >
                  <span>{pages} стр.</span>
                  <span aria-hidden style={{ color: "#2a2a35" }}>·</span>
                  <span>{date}</span>
                  <span aria-hidden style={{ color: "#2a2a35" }}>·</span>
                  <span>PDF</span>
                </div>

                <span
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
                  style={{ color: "#f0f0f5" }}
                >
                  Читать
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
