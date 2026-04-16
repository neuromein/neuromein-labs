import { motion } from "framer-motion";
import { useMemo } from "react";

type Node = { id: number; x: number; y: number; r: number; opacity: number; delay: number };
type Edge = { id: string; from: number; to: number; opacity: number };

function generate(seed = 7) {
  // Deterministic pseudo-random for SSR stability
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const count = 12;
  const nodes: Node[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 60 + rand() * 380,
    y: 40 + rand() * 360,
    r: 3 + rand() * 4,
    opacity: 0.15 + rand() * 0.55,
    delay: rand() * 3,
  }));

  const edges: Edge[] = [];
  for (let i = 0; i < count; i++) {
    // connect each node to 2 nearest neighbours
    const dists = nodes
      .map((n) => ({ id: n.id, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
      .filter((n) => n.id !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const d of dists) {
      const key = [i, d.id].sort().join("-");
      if (!edges.find((e) => e.id === key)) {
        edges.push({ id: key, from: i, to: d.id, opacity: 0.08 + rand() * 0.17 });
      }
    }
  }
  return { nodes, edges };
}

export function NeuralNetwork() {
  const { nodes, edges } = useMemo(() => generate(7), []);

  return (
    <div className="relative w-full aspect-square max-w-[520px] mx-auto">
      {/* Breathing glow */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--color-brand) 18%, transparent) 0%, transparent 60%)",
        }}
        animate={{ opacity: [0.45, 0.9, 0.45] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        viewBox="0 0 500 440"
        className="relative w-full h-full"
        fill="none"
        aria-hidden
      >
        {/* Edges */}
        {edges.map((e) => {
          const from = nodes[e.from];
          const to = nodes[e.to];
          return (
            <line
              key={e.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--color-brand)"
              strokeWidth={0.5}
              opacity={e.opacity}
            />
          );
        })}

        {/* Pulses travelling along edges */}
        {edges.slice(0, 8).map((e, i) => {
          const from = nodes[e.from];
          const to = nodes[e.to];
          return (
            <motion.circle
              key={`pulse-${e.id}`}
              r={1.6}
              fill="var(--color-brand)"
              initial={{ cx: from.x, cy: from.y, opacity: 0 }}
              animate={{
                cx: [from.x, to.x],
                cy: [from.y, to.y],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => (
          <motion.circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={n.r}
            stroke="var(--color-brand)"
            strokeWidth={0.8}
            fill="color-mix(in oklch, var(--color-brand) 12%, transparent)"
            opacity={n.opacity}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              delay: n.delay,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        ))}
      </svg>
    </div>
  );
}
