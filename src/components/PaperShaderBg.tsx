import { Dithering } from "@paper-design/shaders-react";

/**
 * Hero-фон в стиле Paper shaders (Dithering).
 * - Базовый тёмный фон на всём блоке
 * - Справа — Dithering shader (синие точки), реагирует на курсор контейнера-родителя
 * - Слева текст: защищён маской и градиентной виньеткой
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

      {/* Dithering shader — справа, маской ограничен правой зоной */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 95% at 88% 50%, black 30%, rgba(0,0,0,0.7) 60%, transparent 88%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 95% at 88% 50%, black 30%, rgba(0,0,0,0.7) 60%, transparent 88%)",
        }}
      >
        <Dithering
          style={{ width: "100%", height: "100%" }}
          colorBack="#0a0a14"
          colorFront="#7aa2ff"
          shape="warp"
          type="4x4"
          pxSize={2.4}
          offsetX={0}
          offsetY={0}
          scale={1}
          rotation={0}
          speed={0.7}
        />
      </div>

      {/* Левая виньетка — гарантирует читаемость текста */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.10 0.02 260 / 0.96) 0%, oklch(0.10 0.02 260 / 0.75) 28%, oklch(0.10 0.02 260 / 0.25) 48%, transparent 62%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
