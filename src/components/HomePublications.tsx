import { Reveal } from "./Reveal";

/**
 * Типографический «Coming soon» — гигантская приглушённая цифра как графический акцент,
 * текст 18px и осмысленная пауза вместо пустой карточки.
 */
export function HomePublications() {
  return (
    <div>
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.10), transparent)",
        }}
      />

      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 pt-12 lg:pt-16">
          {/* Большая графическая цифра */}
          <div
            className="font-display-serif select-none leading-none"
            style={{
              fontSize: "clamp(120px, 18vw, 220px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.10)",
              lineHeight: 0.85,
            }}
            aria-hidden
          >
            01
          </div>

          {/* Контент */}
          <div className="max-w-[640px]">
            <div
              className="font-mono-meta text-[11px] uppercase flex items-center gap-3"
              style={{ color: "#7a7a8a", letterSpacing: "0.16em" }}
            >
              <span>Заметки</span>
              <span aria-hidden style={{ color: "#2a2a35" }}>·</span>
              <span style={{ color: "var(--accent-cyan)" }}>Скоро</span>
            </div>

            <h2
              className="font-display-serif mt-5"
              style={{
                fontSize: "clamp(32px, 4.5vw, 56px)",
                lineHeight: 1.05,
                color: "#f0f0f5",
              }}
            >
              Готовлю серию коротких разборов:{" "}
              <span style={{ fontStyle: "italic", color: "#9a9aaa" }}>
                новости ИИ, прогнозы и рыночные сдвиги.
              </span>
            </h2>

            <p
              className="mt-8 text-[17px] sm:text-[18px] leading-[1.6] max-w-[520px]"
              style={{ color: "#9a9aaa" }}
            >
              Пока самые свежие наблюдения и заметки выходят в Telegram.
              Подпишитесь, чтобы не пропустить разборы и ранние черновики
              следующих исследований.
            </p>

            <div className="mt-10">
              <a
                href="https://t.me/neuromein"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 text-[15px] font-medium"
                style={{ color: "#f0f0f5" }}
              >
                <span
                  className="pb-1"
                  style={{
                    backgroundImage:
                      "linear-gradient(currentColor, currentColor)",
                    backgroundSize: "100% 1px",
                    backgroundPosition: "0 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  Подписаться в Telegram
                </span>
                <svg
                  width="14"
                  height="14"
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
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
