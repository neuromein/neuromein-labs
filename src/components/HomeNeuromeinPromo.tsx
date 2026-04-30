import { Reveal } from "./Reveal";
import avatarUrl from "@/assets/avatar.jpg";

/**
 * Промо-блок NEUROMEIN.AI: слева текст и счётчик, справа фото автора.
 * Стилистика согласована с AboutHero (мягкое голубое свечение, тонкая сетка).
 */
export function HomeNeuromeinPromo() {
  return (
    <Reveal>
      <section
        className="relative overflow-hidden rounded-[28px] border-[0.5px] border-border"
        style={{
          background:
            "linear-gradient(180deg, #111118 0%, #0a0a10 60%, #08080D 100%)",
        }}
      >
        {/* Soft blue glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 80% 30%, oklch(0.55 0.16 250 / 0.18) 0%, transparent 55%)",
            filter: "blur(40px)",
          }}
        />
        {/* Subtle grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-16 p-8 sm:p-12 lg:p-20 items-center">
          {/* Text + counter */}
          <div className="order-2 lg:order-1">
            <h2
              style={{
                fontSize: "clamp(40px, 6vw, 64px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "#f0f0f5",
              }}
            >
              NEUROMEIN<span style={{ color: "#4A9EF5" }}>.AI</span>
            </h2>

            <p
              className="mt-6"
              style={{
                fontSize: 17,
                lineHeight: 1.65,
                color: "#9a9aaa",
                maxWidth: 460,
              }}
            >
              Аналитический блог о влиянии искусственного интеллекта на бизнес и
              рынок труда. Разборы, прогнозы, авторские исследования.
            </p>

            <div className="mt-12 flex items-center">
              <div>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.05,
                    backgroundImage:
                      "linear-gradient(135deg, #f0f0f5 0%, #4A9EF5 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                >
                  45K+
                </div>
                <div
                  className="mt-2"
                  style={{ fontSize: 14, color: "#7a7a8a" }}
                >
                  подписчиков
                </div>
              </div>
            </div>
          </div>

          {/* Photo */}
          <div
            className="order-1 lg:order-2 relative w-full max-w-[480px] mx-auto lg:mx-0 lg:ml-auto aspect-[4/5] rounded-[24px] overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <img
              src={avatarUrl}
              alt="Андрей Майнгардт — автор NEUROMEIN.AI"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </Reveal>
  );
}
