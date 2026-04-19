import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { RESEARCH } from "@/lib/site";

/**
 * Премиальная сетка исследований в стиле madiyour:
 * - крупные карточки с насыщенным радиальным glow
 * - плавный hover (подъём + усиление свечения)
 * - типографика и плотность как у дорогих AI-сайтов
 */
export function ResearchShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
      {RESEARCH.map((r, i) => (
        <Reveal key={r.slug} delay={i * 0.1}>
          <Link
            to="/research/$slug"
            params={{ slug: r.slug }}
            className="block group h-full cursor-pointer"
          >
            <motion.article
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[28px] border-[0.5px] border-border bg-bg-deep h-full min-h-[340px] p-8 lg:p-10 flex flex-col justify-between"
            >
              {/* Ambient glow that intensifies on hover */}
              <div
                aria-hidden
                className="absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full opacity-50 group-hover:opacity-90 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${r.dotColor} 0%, transparent 65%)`,
                  filter: "blur(60px)",
                }}
              />
              {/* Subtle bottom-left tint */}
              <div
                aria-hidden
                className="absolute -bottom-32 -left-24 w-[360px] h-[360px] rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-700"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, oklch(0.62 0.16 245 / 0.6) 0%, transparent 70%)",
                  filter: "blur(70px)",
                }}
              />
              {/* Grid noise overlay */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              {/* Border highlight on hover */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-[28px] border border-transparent group-hover:border-border-strong transition-colors duration-500 pointer-events-none"
              />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: r.dotColor }}
                    aria-hidden
                  />
                  <span className="label-eyebrow">
                    {r.eyebrow} · {r.year}
                  </span>
                </div>
                <h3 className="mt-7 text-[28px] lg:text-[32px] font-medium text-text-primary tracking-[-0.02em] leading-[1.1] max-w-[20ch]">
                  {r.title}
                </h3>
                <p className="mt-4 text-[14px] text-text-secondary leading-[1.6] max-w-[42ch]">
                  {r.short}
                </p>
              </div>

              <div className="relative mt-10 flex items-center justify-between">
                <span className="text-[12px] text-text-tertiary">
                  {r.date}
                </span>
                <span className="flex items-center gap-2 h-10 px-4 rounded-full border-[0.5px] border-border-strong bg-bg-card/60 backdrop-blur text-[13px] text-text-primary group-hover:bg-bg-card group-hover:border-brand/40 transition-all">
                  Читать
                  <ArrowIcon />
                </span>
              </div>
            </motion.article>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 group-hover:translate-x-0.5"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
