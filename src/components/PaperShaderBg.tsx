import { useEffect, useRef, useState } from "react";

/**
 * Премиальный фон для hero:
 * - Базовый глубокий градиент на всём блоке
 * - Справа — интерактивная "AI нейросеть": сфера из узлов и связей,
 *   которая поворачивается вслед за курсором
 * - Левая зона (где текст) защищена от шейдера маской и виньеткой,
 *   нейросеть туда не заходит
 */
export function PaperShaderBg() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const netRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 600, h: 600 });

  // Resize observer для canvas
  useEffect(() => {
    const el = netRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pointer-driven rotation + animation
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;
    ctx.scale(dpr, dpr);

    // --- сетка узлов на сфере (Fibonacci sphere) ---
    const N = 110;
    const nodes: { x: number; y: number; z: number }[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      nodes.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }

    // связи — между ближайшими соседями
    const edges: [number, number][] = [];
    for (let i = 0; i < N; i++) {
      const dists: { j: number; d: number }[] = [];
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        dists.push({ j, d: dx * dx + dy * dy + dz * dz });
      }
      dists.sort((a, b) => a.d - b.d);
      for (let k = 0; k < 3; k++) {
        const j = dists[k].j;
        if (i < j) edges.push([i, j]);
      }
    }

    // pointer state
    let mx = 0.5;
    let my = 0.5;
    let cx = 0.5;
    let cy = 0.5;
    let inside = false;

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
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let t = 0;

    const draw = () => {
      t += 0.005;
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;

      const w = size.w;
      const h = size.h;
      ctx.clearRect(0, 0, w, h);

      // авто-вращение + влияние курсора
      const targetYaw = (cx - 0.5) * 1.6 + t * 0.6;
      const targetPitch = (cy - 0.5) * -1.2 + Math.sin(t * 0.7) * 0.15;

      const cosY = Math.cos(targetYaw);
      const sinY = Math.sin(targetYaw);
      const cosP = Math.cos(targetPitch);
      const sinP = Math.sin(targetPitch);

      const cxp = w / 2;
      const cyp = h / 2;
      const radius = Math.min(w, h) * 0.42;
      const persp = 1.6;

      const projected = nodes.map((n) => {
        // rotate around Y
        const x1 = n.x * cosY + n.z * sinY;
        const z1 = -n.x * sinY + n.z * cosY;
        // rotate around X
        const y2 = n.y * cosP - z1 * sinP;
        const z2 = n.y * sinP + z1 * cosP;
        const scale = persp / (persp + z2);
        return {
          px: cxp + x1 * radius * scale,
          py: cyp + y2 * radius * scale,
          z: z2,
          s: scale,
        };
      });

      // edges
      for (const [a, b] of edges) {
        const pa = projected[a];
        const pb = projected[b];
        const avgZ = (pa.z + pb.z) / 2;
        const depth = (1 - (avgZ + 1) / 2);
        const alpha = 0.05 + depth * 0.35;
        ctx.strokeStyle = `rgba(120, 170, 255, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(pa.px, pa.py);
        ctx.lineTo(pb.px, pb.py);
        ctx.stroke();
      }

      // nodes
      for (const p of projected) {
        const depth = 1 - (p.z + 1) / 2;
        const r = 1 + depth * 2.4 * p.s;
        const alpha = 0.4 + depth * 0.6;
        // glow
        const grad = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, r * 4);
        grad.addColorStop(0, `rgba(160, 200, 255, ${alpha})`);
        grad.addColorStop(1, "rgba(160, 200, 255, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.px, p.py, r * 4, 0, Math.PI * 2);
        ctx.fill();
        // core
        ctx.fillStyle = `rgba(220, 235, 255, ${Math.min(1, alpha + 0.15)})`;
        ctx.beginPath();
        ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // подсветка центра
      const haze = ctx.createRadialGradient(cxp, cyp, 0, cxp, cyp, radius * 1.4);
      haze.addColorStop(0, `rgba(80, 140, 255, ${inside ? 0.18 : 0.12})`);
      haze.addColorStop(1, "rgba(80, 140, 255, 0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [size.w, size.h]);

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

      {/* Тонкая сетка для глубины */}
      <div
        className="absolute inset-0 opacity-[0.10] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.78 0.15 245 / 0.18) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.15 245 / 0.18) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at 80% 50%, black 10%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 80% 50%, black 10%, transparent 70%)",
        }}
      />

      {/* Контейнер нейросети — строго в правой зоне, не заходит на текст */}
      <div
        ref={netRef}
        className="absolute top-0 bottom-0 right-0 w-full sm:w-[55%] lg:w-[48%] pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse 75% 90% at 65% 50%, black 45%, rgba(0,0,0,0.5) 70%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 90% at 65% 50%, black 45%, rgba(0,0,0,0.5) 70%, transparent 95%)",
        }}
      >
        <canvas ref={canvasRef} className="block" />
      </div>

      {/* Подсветка справа за нейросетью */}
      <div
        className="absolute inset-y-0 right-0 w-[55%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, oklch(0.55 0.18 255 / 0.22) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Виньетка слева — гарантирует читаемость текста */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.10 0.02 260 / 0.95) 0%, oklch(0.10 0.02 260 / 0.7) 30%, oklch(0.10 0.02 260 / 0.2) 50%, transparent 65%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/70 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
