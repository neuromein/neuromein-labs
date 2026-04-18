import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { PUBLICATIONS } from "@/lib/site";

/**
 * Простая лента публикаций без карточки-обёртки.
 * Заголовок секции + строки с тонкими разделителями.
 */
export function HomePublications() {
  const items = PUBLICATIONS.slice(0, 4);
  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <div
            className="text-[11px] uppercase"
            style={{ color: "#5a5a6a", letterSpacing: "0.06em" }}
          >
            Заметки
          </div>
          <h2
            className="mt-2 text-[26px] lg:text-[30px] font-medium leading-[1.15] tracking-[-0.02em]"
            style={{ color: "#f0f0f5" }}
          >
            Последние публикации
          </h2>
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
        {items.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <li>
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-5 transition-colors"
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
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLSpanElement).style.color = "#f0f0f5";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLSpanElement).style.color = "#dddde5";
                  }}
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
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
