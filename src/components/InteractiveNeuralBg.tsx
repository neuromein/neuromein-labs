import { useEffect, useRef } from "react";

/**
 * Современная "AI/нейро" анимация фона:
 * - плавно дышащие градиентные орбы (mesh-gradient feel)
 * - тонкая сетка с эффектом параллакса от курсора
 * - мягкий conic-glow на pointer (radial spotlight)
 * - всё на canvas/CSS, без тяжёлой SVG-сети
 */
export function InteractiveNeuralBg() {
  const ref = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let mx = 0.5;
    let my = 0.5;
    let cx = 0.5;
    let cy = 0.5;
    let raf = 0;
    let inside = false;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
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
      // smooth lerp
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;

      if (spotRef.current) {
        spotRef.current.style.background = `radial-gradient(circle at ${cx * 100}% ${cy * 100}%, oklch(0.72 0.16 245 / ${inside ? 0.35 : 0.18}) 0%, oklch(0.55 0.16 255 / 0.12) 25%, transparent 55%)`;
      }
      // parallax for orbs
      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate3d(${(cx - 0.5) * -40}px, ${(cy - 0.5) * -40}px, 0)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate3d(${(cx - 0.5) * 60}px, ${(cy - 0.5) * 60}px, 0)`;
      }
      if (orb3Ref.current) {
        orb3Ref.current.style.transform = `translate3d(${(cx - 0.5) * -25}px, ${(cy - 0.5) * 25}px, 0)`;
      }
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${(cx - 0.5) * 20}px, ${(cy - 0.5) * 20}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Base deep gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.13 0.03 265) 0%, oklch(0.10 0.02 260) 50%, oklch(0.14 0.04 245) 100%)",
        }}
      />

      {/* Subtle noise grid */}
      <div
        ref={gridRef}
        className="absolute -inset-10 opacity-[0.18] transition-transform duration-300 ease-out"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.78 0.15 245 / 0.18) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.15 245 / 0.18) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Animated gradient orbs */}
      <div
        ref={orb1Ref}
        className="absolute -top-40 -right-32 w-[680px] h-[680px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.68 0.18 250 / 0.55) 0%, oklch(0.55 0.16 255 / 0.18) 40%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orbFloat1 18s ease-in-out infinite",
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute -bottom-48 -left-32 w-[560px] h-[560px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.62 0.18 220 / 0.5) 0%, oklch(0.50 0.14 230 / 0.15) 45%, transparent 70%)",
          filter: "blur(70px)",
          animation: "orbFloat2 22s ease-in-out infinite",
        }}
      />
      <div
        ref={orb3Ref}
        className="absolute top-1/3 left-1/3 w-[420px] h-[420px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.78 0.16 280 / 0.35) 0%, transparent 65%)",
          filter: "blur(60px)",
          animation: "orbFloat3 26s ease-in-out infinite",
        }}
      />

      {/* Pointer spotlight */}
      <div
        ref={spotRef}
        className="absolute inset-0 transition-[background] duration-200 ease-out pointer-events-none"
      />

      {/* Light scan line accent */}
      <svg
        className="absolute inset-x-0 -bottom-20 w-full opacity-50 mix-blend-screen pointer-events-none"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path
          d="M-50 320 Q 300 80, 700 220 T 1300 140"
          stroke="url(#scanGrad)"
          strokeWidth="1"
          fill="none"
        />
        <defs>
          <linearGradient id="scanGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.78 0.15 245 / 0)" />
            <stop offset="50%" stopColor="oklch(0.85 0.16 245 / 0.85)" />
            <stop offset="100%" stopColor="oklch(0.78 0.15 245 / 0)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Vignette for legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-deep/85 via-bg-deep/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/70 via-transparent to-transparent pointer-events-none" />

      <style>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(-30px, 20px, 0) scale(1.08); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(40px, -30px, 0) scale(1.1); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(-20px, -40px, 0) scale(0.92); }
        }
      `}</style>
    </div>
  );
}
