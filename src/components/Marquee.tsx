/**
 * Бесконечная горизонтальная бегущая строка (фоновый паттерн).
 * Используется как разделитель между секциями главной страницы.
 */
export function Marquee({
  text = "ТИХАЯ ЗАМЕНА · AI-АНАЛИТИКА · ПРОГНОЗЫ 2026–2030 · РЫНОК ТРУДА · NEUROMEIN ·",
  repeat = 4,
}: {
  text?: string;
  repeat?: number;
}) {
  const phrase = Array.from({ length: repeat }, () => text).join(" ");
  // Duplicate the phrase to make the loop seamless (translateX -50%)
  const full = `${phrase} ${phrase}`;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ padding: "40px 0" }}
      aria-hidden
    >
      <div
        className="marquee-track whitespace-nowrap"
        style={{
          fontWeight: 500,
          color: "#1a1a24",
          letterSpacing: "-0.01em",
        }}
      >
        <span className="marquee-text">{full}</span>
      </div>
    </div>
  );
}
