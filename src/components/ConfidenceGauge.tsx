/**
 * Confidence gauge — горизонтальная штриховка из 10 рисок (как сейсмограф).
 * Заполнено столько рисок, сколько десятков процентов уверенности.
 * Цвет — тематический (theme color), приглушённые серые для незаполненных.
 * Используется вместо мёртвой «пилюли с %» в карточках прогнозов.
 */
export function ConfidenceGauge({
  confidence,
  color,
  label = "Уверенность",
}: {
  confidence: number; // 0-100
  color: string; // hex
  label?: string;
}) {
  const filled = Math.round(confidence / 10);
  return (
    <div
      className="flex flex-col gap-1.5"
      role="img"
      aria-label={`${label} ${confidence}%`}
    >
      <div className="flex items-baseline justify-between">
        <span
          className="text-[10px] tracking-[0.14em] uppercase text-text-tertiary font-medium"
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
        >
          {label}
        </span>
        <span
          className="text-[12px] tabular-nums font-medium"
          style={{ color, fontFeatureSettings: '"tnum"' }}
        >
          {confidence}%
        </span>
      </div>
      <div className="flex gap-[3px] items-end h-3">
        {Array.from({ length: 10 }).map((_, i) => {
          const isOn = i < filled;
          // Высота риски слегка нарастает — как сейсмограф / spectrum-meter
          const h = 6 + i * 0.7;
          return (
            <span
              key={i}
              className="flex-1 rounded-[1px] transition-colors"
              style={{
                height: h,
                background: isOn ? color : "rgba(255,255,255,0.08)",
                opacity: isOn ? 1 : 1,
              }}
              aria-hidden
            />
          );
        })}
      </div>
    </div>
  );
}
