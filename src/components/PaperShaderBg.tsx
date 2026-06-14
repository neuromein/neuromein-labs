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

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
      inside = true;
    };
    const onLeave = () => {
      inside = false;
      mx = 0.5;
      my = 0.5;
    };

    const tick = () => {
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;

      const dx = (cx - 0.5) * 2; // -1..1
      const dy = (cy - 0.5) * 2;

      setShaderState({
        offsetX: dx * 0.6,
        offsetY: dy * 0.6,
        scale: 1 + Math.hypot(dx, dy) * 0.35,
        rotation: dx * 25,
        speed: inside ? 1.4 : 0.6,
        pxSize: inside ? 2.0 : 2.4,
      });

      raf = requestAnimationFrame(tick);
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
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
