import { motion } from "framer-motion";

/**
 * Абстрактная SVG-нейросеть для hero-секции.
 * - 12 узлов разного размера и opacity
 * - тонкие соединительные линии
 * - 2 пульсирующих главных узла
 * - 3 движущихся "импульса" вдоль линий
 * - дышащее центральное свечение
 */

// Координаты узлов (viewBox 400x400)
const NODES = [
  { id: "n1", cx: 80, cy: 90, r: 3, opacity: 0.35 },
  { id: "n2", cx: 200, cy: 60, r: 2.5, opacity: 0.25 },
  { id: "n3", cx: 320, cy: 100, r: 4, opacity: 0.5 },
  { id: "n4", cx: 60, cy: 200, r: 2, opacity: 0.2 },
  { id: "n5", cx: 180, cy: 200, r: 5, opacity: 0.7, primary: true }, // primary
  { id: "n6", cx: 310, cy: 220, r: 3, opacity: 0.4 },
  { id: "n7", cx: 100, cy: 320, r: 2.5, opacity: 0.3 },
  { id: "n8", cx: 220, cy: 340, r: 4, opacity: 0.55, primary: true }, // primary
  { id: "n9", cx: 340, cy: 320, r: 2, opacity: 0.2 },
  { id: "n10", cx: 250, cy: 130, r: 2, opacity: 0.18 },
  { id: "n11", cx: 130, cy: 140, r: 2, opacity: 0.22 },
  { id: "n12", cx: 280, cy: 280, r: 2.5, opacity: 0.28 },
];

// Соединения (пары id) – формируют структуру сети
const LINKS: Array<[string, string, number]> = [
  ["n1", "n2", 0.18],
  ["n2", "n3", 0.2],
  ["n1", "n4", 0.12],
  ["n2", "n5", 0.22],
  ["n3", "n6", 0.18],
  ["n4", "n5", 0.15],
  ["n5", "n6", 0.25],
  ["n4", "n7", 0.1],
  ["n5", "n8", 0.22],
  ["n6", "n9", 0.12],
  ["n7", "n8", 0.2],
  ["n8", "n9", 0.18],
  ["n5", "n11", 0.14],
  ["n5", "n10", 0.18],
  ["n3", "n10", 0.1],
  ["n6", "n12", 0.15],
  ["n8", "n12", 0.18],
  ["n11", "n7", 0.1],
];

function getNode(id: string) {
  return NODES.find((n) => n.id === id)!;
}

// Импульсы вдоль конкретных линий (от → к, длительность)
const PULSES = [
  { from: "n2", to: "n5", duration: 4.5 },
  { from: "n5", to: "n8", duration: 5.2 },
  { from: "n3", to: "n6", duration: 4.0 },
];

export function HeroNeuralSvg() {
  return (
    <div className="relative w-full h-full">
      {/* Центральное дышащее свечение */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #4A9EF5 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      <svg
        viewBox="0 0 400 400"
        className="relative w-full h-full"
        fill="none"
        aria-hidden
      >
        {/* Соединительные линии */}
        {LINKS.map(([fromId, toId, opacity], i) => {
          const a = getNode(fromId);
          const b = getNode(toId);
          return (
            <line
              key={`l-${i}`}
              x1={a.cx}
              y1={a.cy}
              x2={b.cx}
              y2={b.cy}
              stroke="#4A9EF5"
              strokeWidth="0.5"
              opacity={opacity}
            />
          );
        })}

        {/* Узлы */}
        {NODES.map((n) => {
          if (n.primary) {
            return (
              <g key={n.id}>
                {/* пульсирующий главный узел */}
                <motion.circle
                  cx={n.cx}
                  cy={n.cy}
                  r={n.r}
                  stroke="#4A9EF5"
                  strokeWidth="0.8"
                  fill="#4A9EF5"
                  fillOpacity={0.4}
                  initial={{ scale: 1, opacity: n.opacity }}
                  animate={{ scale: [1, 1.08, 1], opacity: [n.opacity, 0.9, n.opacity] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
                />
              </g>
            );
          }
          return (
            <circle
              key={n.id}
              cx={n.cx}
              cy={n.cy}
              r={n.r}
              stroke="#4A9EF5"
              strokeWidth="0.6"
              fill="transparent"
              opacity={n.opacity}
            />
          );
        })}

        {/* Движущиеся импульсы вдоль линий */}
        {PULSES.map((p, i) => {
          const a = getNode(p.from);
          const b = getNode(p.to);
          return (
            <motion.circle
              key={`pulse-${i}`}
              r="1.5"
              fill="#4A9EF5"
              initial={{ cx: a.cx, cy: a.cy, opacity: 0 }}
              animate={{
                cx: [a.cx, b.cx],
                cy: [a.cy, b.cy],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
                times: [0, 0.15, 0.85, 1],
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
