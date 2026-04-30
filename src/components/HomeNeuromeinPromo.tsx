import { Reveal } from "./Reveal";
import instagramShot from "@/assets/neuromein-instagram.png";

/**
 * Промо-блок NEUROMEIN.AI — слева текст и счётчик,
 * справа полный скриншот Instagram-страницы (без обрезки).
 */
export function HomeNeuromeinPromo() {
  return (
    <Reveal>
      <section className="relative grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center py-10 lg:py-20">
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

        {/* Instagram screenshot — full, no crop */}
        <div className="order-1 lg:order-2 w-full">
          <img
            src={instagramShot}
            alt="Страница NEUROMEIN.AI в Instagram"
            className="w-full h-auto block rounded-[16px]"
            loading="lazy"
          />
        </div>
      </section>
    </Reveal>
  );
}
