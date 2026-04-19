import { motion } from "framer-motion";
import type { CSSProperties } from "react";

type Props = {
  children: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  stagger?: number;
};

/**
 * Кинематографический display-заголовок: каждое слово появляется
 * с лёгкой задержкой и подъёмом снизу. Используется для hero/page-title.
 */
export function DisplayHeading({
  children,
  className = "",
  style,
  delay = 0,
  stagger = 0.08,
}: Props) {
  const words = children.split(" ");
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={`display-hero display-hero--fade ${className}`}
      style={style}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: "0.28em" }}
          variants={{
            hidden: { opacity: 0, y: "0.35em" },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.9, ease },
            },
          }}
        >
          {w}
        </motion.span>
      ))}
    </motion.h1>
  );
}
