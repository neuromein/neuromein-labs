import { Dithering } from "@paper-design/shaders-react";

/**
 * Премиальный фон на Paper shaders (Dithering).
 * - Заполняет весь контейнер
 * - Маска вырезает зону текста (слева), чтобы шейдер не "задевал" контент
 * - Сверху виньетка для читаемости
 */
export function PaperShaderBg() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Базовый глубокий фон */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.13 0.03 265) 0%, oklch(0.10 0.02 260) 50%, oklch(0.14 0.04 245) 100%)",
        }}
      />

      {/* Paper shader слой — маска убирает шейдер из левой "текстовой" зоны */}
      <div
        className="absolute inset-0"
        style={{
          // На мобильных шейдер мягче и снизу; на десктопе — справа, не залезая на текст
          maskImage:
            "radial-gradient(ellipse 70% 90% at 85% 50%, black 35%, rgba(0,0,0,0.6) 60%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 90% at 85% 50%, black 35%, rgba(0,0,0,0.6) 60%, transparent 85%)",
        }}
      >
        <Dithering
          style={{ width: "100%", height: "100%" }}
          colorBack="#0a0a14"
          colorFront="#5b8def"
          shape="sphere"
          type="4x4"
          pxSize={2}
          offsetX={0}
          offsetY={0}
          scale={0.9}
          rotation={0}
          speed={0.6}
        />
      </div>

      {/* Мягкий blue glow поверх стыка, чтобы переход был плавным */}
      <div
        className="absolute inset-y-0 right-0 w-[55%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, oklch(0.55 0.18 255 / 0.25) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Виньетки для читаемости текста слева/сверху/снизу */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.10 0.02 260 / 0.92) 0%, oklch(0.10 0.02 260 / 0.6) 35%, transparent 65%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/70 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
