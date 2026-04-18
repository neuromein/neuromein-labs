import { useEffect, useMemo, useRef, useState } from "react";

type Node = { id: number; x: number; y: number; r: number; baseOpacity: number };
type Edge = { id: string; from: number; to: number; opacity: number };

function generate(seed = 11, count = 26, w = 1000, h = 600) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const nodes: Node[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 60 + rand() * (w - 120),
    y: 60 + rand() * (h - 120),
    r: 2 + rand() * 3.5,
    baseOpacity: 0.25 + rand() * 0.55,
  }));

  const edges: Edge[] = [];
  for (let i = 0; i < count; i++) {
    const dists = nodes
      .map((n) => ({ id: n.id, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
      .filter((n) => n.id !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
    for (const d of dists) {
      const key = [i, d.id].sort((a, b) => a - b).join("-");
      if (!edges.find((e) => e.id === key)) {
        edges.push({ id: key, from: i, to: d.id, opacity: 0.08 + rand() * 0.18 });
      }
    }
  }
  return { nodes, edges };
}

/**
 * Интерактивная анимация нейросети для фона hero-карточки.
 * Узлы подсвечиваются и слегка смещаются вслед за курсором.
 */
export function InteractiveNeuralBg() {
  const VW = 1000;
  const VH = 600;
  const { nodes, edges } = useMemo(() => generate(11, 28, VW, VH), []);
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const tick = () => {
      setPulse((p) => (p + 1) % 1000);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * VW;
    const ny = ((e.clientY - rect.top) / rect.height) * VH;
    setMouse({ x: nx, y: ny });
  };

  const handleLeave = () => setMouse(null);

  // Compute displaced nodes based on mouse proximity
  const displaced = nodes.map((n) => {
    if (!mouse) return { ...n, dx: 0, dy: 0, glow: 0 };
    const dx = n.x - mouse.x;
    const dy = n.y - mouse.y;
    const dist = Math.hypot(dx, dy);
    const radius = 220;
    if (dist > radius) return { ...n, dx: 0, dy: 0, glow: 0 };
    const force = (1 - dist / radius) ** 2;
    const angle = Math.atan2(dy, dx);
    return {
      ...n,
      dx: Math.cos(angle) * force * 26,
      dy: Math.sin(angle) * force * 26,
      glow: force,
    };
  });

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="absolute inset-0 z-0"
      aria-hidden
    >
      {/* Soft gradient backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, oklch(0.55 0.16 255 / 0.35) 0%, oklch(0.35 0.10 250 / 0.18) 35%, transparent 70%), radial-gradient(ellipse at 20% 80%, oklch(0.6 0.12 220 / 0.25) 0%, transparent 60%)",
        }}
      />

      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        fill="none"
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.78 0.15 245 / 0.9)" />
            <stop offset="60%" stopColor="oklch(0.68 0.14 250 / 0.3)" />
            <stop offset="100%" stopColor="oklch(0.68 0.14 250 / 0)" />
          </radialGradient>
          <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.78 0.15 245 / 0.6)" />
            <stop offset="100%" stopColor="oklch(0.55 0.16 255 / 0.2)" />
          </linearGradient>
        </defs>

        {/* Edges */}
        {edges.map((e) => {
          const from = displaced[e.from];
          const to = displaced[e.to];
          const glow = Math.max(from.glow, to.glow);
          return (
            <line
              key={e.id}
              x1={from.x + from.dx}
              y1={from.y + from.dy}
              x2={to.x + to.dx}
              y2={to.y + to.dy}
              stroke={glow > 0.05 ? "url(#edgeGrad)" : "oklch(0.78 0.15 245)"}
              strokeWidth={0.5 + glow * 1.2}
              opacity={e.opacity + glow * 0.5}
              style={{ transition: "opacity 0.3s ease, stroke-width 0.3s ease" }}
            />
          );
        })}

        {/* Travelling pulses on subset of edges */}
        {edges.slice(0, 10).map((e, i) => {
          const from = nodes[e.from];
          const to = nodes[e.to];
          const t = ((pulse + i * 80) % 400) / 400;
          const cx = from.x + (to.x - from.x) * t;
          const cy = from.y + (to.y - from.y) * t;
          const op = Math.sin(t * Math.PI);
          return (
            <circle
              key={`pulse-${e.id}-${i}`}
              cx={cx}
              cy={cy}
              r={1.6}
              fill="oklch(0.85 0.14 240)"
              opacity={op * 0.9}
            />
          );
        })}

        {/* Nodes */}
        {displaced.map((n) => {
          const r = n.r + n.glow * 3;
          return (
            <g key={n.id}>
              {n.glow > 0.1 && (
                <circle
                  cx={n.x + n.dx}
                  cy={n.y + n.dy}
                  r={r * 5}
                  fill="url(#nodeGlow)"
                  opacity={n.glow * 0.8}
                />
              )}
              <circle
                cx={n.x + n.dx}
                cy={n.y + n.dy}
                r={r}
                fill="oklch(0.78 0.15 245 / 0.85)"
                stroke="oklch(0.9 0.1 240 / 0.9)"
                strokeWidth={0.6}
                opacity={n.baseOpacity + n.glow * 0.5}
                style={{ transition: "r 0.25s ease" }}
              />
            </g>
          );
        })}
      </svg>

      {/* Vignette to keep text legible */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-deep/85 via-bg-deep/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/70 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
