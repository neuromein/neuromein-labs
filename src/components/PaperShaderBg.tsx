import { Dithering } from "@paper-design/shaders-react";
import { useEffect, useRef, useState } from "react";

/**
 * Hero-фон в стиле Paper shaders (Dithering) — "нейронная волна".
 * - Базовый Dithering-слой: глобальная волна, всегда живая
 * - Второй Dithering-слой (mix-blend) усиливает ИИ-ассоциацию: тонкая сетка
 * - Сильная реакция на курсор: offset, scale, rotation, speed, pxSize, цвет
 * - При hover ярче (brightness/contrast/saturate) и быстрее
 * - Защитная маска: shader не заходит на текст ни на одном брейкпоинте
 */
export function PaperShaderBg() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [s, setS] = useState({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    rotation: 0,
    speed: 0.7,
    pxSize: 2.4,
    intensity: 0, // 0..1 — насколько активна "волна"
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Pointer interactivity — сильнее искажения и реакция
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let mx = 0.5;
    let my = 0.5;
    let cx = 0.5;
    let cy = 0.5;
    let inside = false;
    let intensity = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
      if (!inside) {
        inside = true;
        setHovered(true);
      }
    };
    const onLeave = () => {
      inside = false;
      setHovered(false);
      mx = 0.5;
      my = 0.5;
    };

    const tick = () => {
      // более резкий lerp
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      const targetIntensity = inside ? 1 : 0;
      intensity += (targetIntensity - intensity) * 0.08;

      const dx = (cx - 0.5) * 2; // -1..1
      const dy = (cy - 0.5) * 2;
      const dist = Math.hypot(dx, dy);

      setS({
        // намного сильнее смещение
        offsetX: dx * 1.6,
        offsetY: dy * 1.6,
        // волна "вздувается" под курсором
        scale: 1 + dist * 0.9 + intensity * 0.4,
        // вращение — выраженное
        rotation: dx * 60 + intensity * Math.sin(performance.now() * 0.001) * 15,
        // скорость почти удваивается при hover
        speed: 0.7 + intensity * 1.6,
        // меньше пиксели = тоньше "нейронные" связи при наведении
        pxSize: 2.6 - intensity * 1.0,
        intensity,
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

  // Маска под shader (адаптивная)
  const shaderMask = isMobile
    ? "radial-gradient(ellipse 110% 60% at 50% 100%, black 25%, rgba(0,0,0,0.6) 55%, transparent 85%)"
    : "radial-gradient(ellipse 60% 95% at 92% 50%, black 28%, rgba(0,0,0,0.7) 58%, transparent 88%)";

  // Цвета: при hover — ярче и более "электрический"
  const front = hovered ? "#a8c4ff" : "#7aa2ff";

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

      {/* Основной shader — "нейронная волна" */}
      <div
        className="absolute inset-0 pointer-events-none transition-[mask-image,filter] duration-300"
        style={{
          maskImage: shaderMask,
          WebkitMaskImage: shaderMask,
          filter: hovered
            ? "brightness(1.35) contrast(1.15) saturate(1.4)"
            : "brightness(1) contrast(1) saturate(1)",
        }}
      >
        <Dithering
          style={{ width: "100%", height: "100%" }}
          colorBack="#0a0a14"
          colorFront={front}
          shape="warp"
          type="4x4"
          pxSize={s.pxSize}
          offsetX={s.offsetX}
          offsetY={s.offsetY}
          scale={s.scale}
          rotation={s.rotation}
          speed={s.speed}
        />
      </div>

      {/* Второй shader — тонкая "нейронная сетка" поверх, усиливает ИИ-ассоциацию */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          maskImage: shaderMask,
          WebkitMaskImage: shaderMask,
          mixBlendMode: "screen",
          opacity: 0.35 + s.intensity * 0.4,
          filter: "blur(0.3px)",
        }}
      >
        <Dithering
          style={{ width: "100%", height: "100%" }}
          colorBack="#00000000"
          colorFront="#c8d8ff"
          shape="simplex"
          type="2x2"
          pxSize={1.6}
          offsetX={-s.offsetX * 0.5}
          offsetY={-s.offsetY * 0.5}
          scale={1.4 + s.intensity * 0.6}
          rotation={-s.rotation * 0.4}
          speed={1.2 + s.intensity * 1.4}
        />
      </div>

      {/* Свечение под курсором — усиливает "нейронный пульс" */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: s.intensity,
          background: `radial-gradient(circle 320px at ${50 + s.offsetX * 30}% ${50 + s.offsetY * 30}%, oklch(0.75 0.18 250 / 0.35) 0%, transparent 60%)`,
          maskImage: shaderMask,
          WebkitMaskImage: shaderMask,
          mixBlendMode: "screen",
        }}
      />

      {/* Защитная виньетка под текстом (адаптивная) */}
      <div
        className="absolute inset-0 pointer-events-none hidden sm:block"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.10 0.02 260 / 0.98) 0%, oklch(0.10 0.02 260 / 0.85) 30%, oklch(0.10 0.02 260 / 0.4) 50%, transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none sm:hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.10 0.02 260 / 0.96) 0%, oklch(0.10 0.02 260 / 0.8) 35%, oklch(0.10 0.02 260 / 0.35) 60%, transparent 80%)",
        }}
      />

      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg-deep/50 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg-deep/50 to-transparent pointer-events-none" />
    </div>
  );
}
