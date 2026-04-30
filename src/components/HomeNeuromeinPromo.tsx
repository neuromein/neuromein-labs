import { Reveal } from "./Reveal";
import instagramShot from "@/assets/neuromein-instagram.png";

/**
 * Промо-блок NEUROMEIN.AI в стиле Carbon (framer):
 * слева текст + счётчик, справа скриншот Instagram в стилизованной
 * browser-рамке с мягким голубым свечением и виньеткой по краям.
 */
export function HomeNeuromeinPromo() {
  return (
    <Reveal>
      <section
        className="relative rounded-[28px] border border-white/[0.06] pl-6 sm:pl-10 lg:pl-16 pr-0 py-14 lg:py-20"
        style={{
          overflowX: "clip",
          overflowY: "visible",
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(74,158,245,0.12) 0%, rgba(74,158,245,0) 55%), linear-gradient(180deg, #0d0d12 0%, #08080c 100%)",
        }}
      >
        {/* мягкая виньетка по краям как в Carbon */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-[0.42fr_1.85fr] gap-12 lg:gap-8 items-center">
        {/* Text */}
        <div className="order-2 lg:order-1 pr-6 sm:pr-10 lg:pr-0 flex flex-col justify-center">
          <h2
            style={{
              fontSize: "clamp(34px, 4.8vw, 54px)",
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
            рынок труда. Разборы, прогнозы, авторские исследования
          </p>

          <div className="flex flex-col" style={{ marginTop: 36 }}>
            <span
              style={{
                fontSize: 48,
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
            <span style={{ fontSize: 15, color: "#7a7a8a", marginTop: 6 }}>
              подписчиков
            </span>
          </div>
        </div>

        {/* Instagram screenshot в browser-рамке со свечением */}
        <div className="order-1 lg:order-2 relative lg:-mr-px lg:translate-x-2">
          {/* голубое свечение под рамкой */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-10"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(74,158,245,0.35) 0%, rgba(74,158,245,0.08) 45%, transparent 75%)",
              filter: "blur(40px)",
            }}
          />

          <div
            className="relative rounded-l-[14px] lg:rounded-r-none rounded-[14px] overflow-hidden border border-white/10"
            style={{
              background: "#0a0a0f",
              boxShadow:
                "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 60px -10px rgba(74,158,245,0.25)",
            }}
          >
            {/* title bar (macOS-style) */}
            <div
              className="flex items-center gap-2 px-4 h-9 border-b border-white/[0.06]"
              style={{
                background:
                  "linear-gradient(180deg, #15151c 0%, #0e0e14 100%)",
              }}
            >
              <span className="rounded-full" style={{ width: 8, height: 8, background: "#ff5f57" }} />
              <span className="rounded-full" style={{ width: 8, height: 8, background: "#febc2e" }} />
              <span className="rounded-full" style={{ width: 8, height: 8, background: "#28c840" }} />
            </div>

            <div className="relative">
              <img
                src={instagramShot}
                alt="Страница NEUROMEIN.AI в Instagram"
                className="w-full h-auto block"
                loading="lazy"
              />
              {/* плавный градиент снизу изображения */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0"
                style={{
                  height: "25%",
                  background:
                    "linear-gradient(to top, #0c0c12 0%, rgba(12,12,18,0.6) 40%, rgba(12,12,18,0.2) 70%, transparent 100%)",
                }}
              />
            </div>
          </div>
        </div>
        </div>
      </section>
    </Reveal>
  );
}
