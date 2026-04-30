import { Reveal } from "./Reveal";
import portraitUrl from "@/assets/neuromein-portrait.jpg";

/**
 * Промо-блок NEUROMEIN.AI — спокойная композиция в духе Carbon:
 * крупный заголовок и описание слева, портрет справа на фоне страницы,
 * без декоративной рамки и сетки.
 */
export function HomeNeuromeinPromo() {
  return (
    <Reveal>
      <section className="relative grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-center py-10 lg:py-20">
        {/* Text */}
        <div className="order-2 lg:order-1">
          <h2
            style={{
              fontSize: "clamp(44px, 6.4vw, 72px)",
              fontWeight: 600,
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
              color: "#f0f0f5",
            }}
          >
            NEUROMEIN<span style={{ color: "#4A9EF5" }}>.AI</span>
          </h2>

          <p
            className="mt-7"
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

          <div className="mt-12 flex items-baseline gap-3">
            <span
              style={{
                fontSize: "clamp(40px, 4.5vw, 52px)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                backgroundImage:
                  "linear-gradient(135deg, #f0f0f5 0%, #4A9EF5 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              45K+
            </span>
            <span style={{ fontSize: 15, color: "#7a7a8a" }}>подписчиков</span>
          </div>
        </div>

        {/* Portrait */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <div
            className="relative"
            style={{
              width: "min(360px, 80vw)",
              aspectRatio: "1 / 1",
            }}
          >
            {/* Soft glow behind */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(74,158,245,0.25) 0%, transparent 65%)",
                filter: "blur(30px)",
                transform: "scale(1.15)",
              }}
            />
            <img
              src={portraitUrl}
              alt="Андрей Майнгардт — автор NEUROMEIN.AI"
              className="relative w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </Reveal>
  );
}
