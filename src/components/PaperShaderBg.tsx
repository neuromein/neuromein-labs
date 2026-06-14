import { Dithering } from "@paper-design/shaders-react";
import { useEffect, useRef, useState } from "react";

/**
 * Hero-фон в стиле Paper shaders (Dithering).
 * - Базовый тёмный фон на всём блоке
 * - Справа – Dithering shader: "нейросеть-волна"
 * - При наведении мыши: shader реагирует – смещается offset, ускоряется,
 *   усиливается "волновой" эффект (warp shape с динамическим scale/rotation)
 * - Слева текст: защищён маской и виньеткой на ВСЕХ брейкпоинтах:
 *   mobile (<640): shader снизу, текст сверху
 *   tablet/desktop: shader справа, текст слева
 */
export function PaperShaderBg() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [shaderState, setShaderState] = useState({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    rotation: 0,
    speed: 0.6,
    pxSize: 2.4,
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Pointer interactivity: lerp shader params toward cursor position
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let mx = 0.5;
    let my = 0.5;
    let cx = 0.5;
    let cy = 0.5;
    let inside = false;
    let raf = 0;

    // Listen on window so the shader reacts everywhere over the hero,
    // even when the cursor is above the text column (which has its own
    // pointer-events). Без этого реакция была только по углам блока.
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        mx = x;
        my = y;
        inside = true;
      } else {
        inside = false;
        mx = 0.5;
        my = 0.5;
      }
    };
    const onLeave = () => {
      inside = false;
      mx = 0.5;
      my = 0.5;
    };

    const tick = () => {
      // более медленный lerp – плавнее следует за курсором
      cx += (mx - cx) * 0.025;
      cy += (my - cy) * 0.025;

      const dx = (cx - 0.5) * 2; // -1..1
      const dy = (cy - 0.5) * 2;

      setShaderState({
        offsetX: dx * 0.45,
        offsetY: dy * 0.45,
        scale: 1 + Math.hypot(dx, dy) * 0.2,
        rotation: dx * 12,
        speed: inside ? 0.45 : 0.25,
        pxSize: inside ? 2.2 : 2.4,
      });

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Маски: на мобильном shader снизу (текст сверху), на десктопе – справа
  const shaderMask = isMobile
    ? "radial-gradient(ellipse 110% 60% at 50% 100%, black 25%, rgba(0,0,0,0.6) 55%, transparent 85%)"
    : "radial-gradient(ellipse 85% 130% at 100% 20%, black 45%, rgba(0,0,0,0.8) 70%, transparent 100%)";

  return (
    <div ref={wrapRef} className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Базовый глубокий фон */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.13 0.03 265) 0%, oklch(0.10 0.02 260) 50%, oklch(0.14 0.04 245) 100%)",
        }}
      />

      {/* Dithering shader – ограничен маской справа/снизу, не заходит на текст */}
      <div
        className="absolute inset-0 pointer-events-none transition-[mask-image] duration-300"
        style={{
          maskImage: shaderMask,
          WebkitMaskImage: shaderMask,
        }}
      >
        <Dithering
          style={{ width: "100%", height: "100%" }}
          colorBack="#0a0a14"
          colorFront="#7aa2ff"
          shape="warp"
          type="4x4"
          pxSize={shaderState.pxSize}
          offsetX={shaderState.offsetX}
          offsetY={shaderState.offsetY}
          scale={shaderState.scale}
          rotation={shaderState.rotation}
          speed={shaderState.speed}
        />
      </div>

      {/* Защитная виньетка под текстом (адаптивная) */}
      {/* Desktop / tablet: затемняем левую часть */}
      <div
        className="absolute inset-0 pointer-events-none hidden sm:block"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.10 0.02 260 / 0.98) 0%, oklch(0.10 0.02 260 / 0.88) 35%, oklch(0.10 0.02 260 / 0.45) 55%, transparent 75%)",
        }}
      />
      {/* Mobile: затемняем верхнюю часть */}
      <div
        className="absolute inset-0 pointer-events-none sm:hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.10 0.02 260 / 0.96) 0%, oklch(0.10 0.02 260 / 0.8) 35%, oklch(0.10 0.02 260 / 0.35) 60%, transparent 80%)",
        }}
      />

      {/* Лёгкие верх/низ виньетки */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg-deep/50 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-deep/50 to-transparent pointer-events-none" />
    </div>
  );
}
