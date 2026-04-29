import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { METHODOLOGY } from "@/data/methodology";

export const Route = createFileRoute("/methodology/")({
  head: () => ({
    meta: [
      { title: "Методология анализа — Андрей Майнгардт | NEUROMEIN" },
      {
        name: "description",
        content:
          "Аналитические модели, которые я использую для оценки влияния ИИ на рынок труда: четыре звена кризиса, эффект односторонней двери, пирамида и гантель.",
      },
      { property: "og:title", content: "Методология анализа — NEUROMEIN" },
      {
        property: "og:description",
        content:
          "Авторские концепции из исследования «Тихая замена»: модели, через которые я анализирую ИИ-замещение.",
      },
      { property: "og:url", content: "https://neuromein.ru/methodology" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: MethodologyIndex,
});

function MethodologyIndex() {
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <Reveal>
          <div className="max-w-[820px]">
            <h1 className="mt-4 text-[40px] lg:text-[56px] font-medium leading-[1.05] tracking-[-0.025em] text-text-primary">
              Методология анализа
            </h1>
            <p className="mt-6 text-[18px] lg:text-[20px] leading-[1.5] text-text-secondary">
              Аналитические инструменты, которые я использую для оценки влияния
              ИИ на рынок труда и бизнес
            </p>
            <p className="mt-8 text-[15px] lg:text-[16px] leading-[1.65] text-text-secondary max-w-[68ch]">
              В своих исследованиях я разработал несколько аналитических моделей,
              которые помогают увидеть механику ИИ-замещения - не абстрактно, а
              в конкретных сценариях. Каждая концепция ниже - это инструмент,
              который я использую в работе с компаниями и в публичной аналитике.
              Все они впервые описаны в исследовании «Тихая замена» (март 2026).
            </p>
          </div>
        </Reveal>

        <div className="mt-14 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {METHODOLOGY.map((m, i) => (
            <Reveal key={m.slug} delay={i * 0.08}>
              <Link
                to="/methodology/$slug"
                params={{ slug: m.slug }}
                className="group block h-full"
              >
                <article
                  className="relative h-full flex flex-col overflow-hidden transition-all duration-300"
                  style={{
                    minHeight: 260,
                    background: "#0c0c12",
                    border: "1px solid #1c1c28",
                    borderRadius: 12,
                    padding: "28px 30px",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(74,158,245,0.3)";
                    el.style.boxShadow = "0 4px 24px rgba(74,158,245,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "#1c1c28";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute top-0 left-0 right-0 pointer-events-none"
                    style={{
                      height: "40%",
                      background:
                        "linear-gradient(to bottom, rgba(74,158,245,0.06), transparent)",
                    }}
                  />
                  <span
                    className="relative text-[11px] uppercase"
                    style={{ color: "#5a5a6a", letterSpacing: "0.06em" }}
                  >
                    Концепция · {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2
                    className="relative mt-4 text-[22px] lg:text-[24px] font-medium leading-[1.2] tracking-[-0.02em]"
                    style={{ color: "#f0f0f5" }}
                  >
                    {m.title}
                  </h2>
                  <p
                    className="relative mt-4 text-[14px] leading-[1.55] flex-grow"
                    style={{ color: "#9a9aaa" }}
                  >
                    {m.cardShort}
                  </p>
                  <span
                    className="relative mt-6 inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-medium self-start"
                    style={{
                      border: "1px solid #2a2a35",
                      color: "#f0f0f5",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    Читать →
                  </span>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Layout>
  );
}