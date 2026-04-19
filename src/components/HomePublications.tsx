import { Reveal } from "./Reveal";

/**
 * Заголовок секции + пустое состояние с CTA на Telegram.
 * Реальные публикации появятся позже.
 */
export function HomePublications() {
  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2
            className="mt-2 text-[26px] lg:text-[30px] font-medium leading-[1.15] tracking-[-0.02em]"
            style={{ color: "#f0f0f5" }}
          >
            Последние публикации
          </h2>
        </div>
      </div>

      <Reveal>
        <div
          className="rounded-[16px] p-8 lg:p-10 flex flex-col items-start gap-5"
          style={{
            background: "#0c0c12",
            border: "1px solid #1c1c28",
          }}
        >
          <p
            className="text-[15px] leading-[1.6] max-w-[560px]"
            style={{ color: "#9a9aaa" }}
          >
            Публикации скоро появятся. Подпишитесь на Telegram-канал, чтобы не пропустить.
          </p>
          <a
            href="https://t.me/neuromein"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center h-[40px] px-5 rounded-[8px] text-[13px] font-medium transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
            style={{ background: "#f0f0f5", color: "#08080D" }}
          >
            Telegram-канал →
          </a>
        </div>
      </Reveal>
    </div>
  );
}
