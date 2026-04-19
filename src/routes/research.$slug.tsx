import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Reveal, FadeIn } from "@/components/Reveal";
import { ArrowLink } from "@/components/ui-bits";
import { RESEARCH } from "@/lib/site";

const PdfReader = lazy(() =>
  import("@/components/PdfReader").then((m) => ({ default: m.PdfReader })),
);

export const Route = createFileRoute("/research/$slug")({
  loader: ({ params }) => {
    const item = RESEARCH.find((r) => r.slug === params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    const r = loaderData?.item;
    if (!r) return { meta: [{ title: "Исследование — NEUROMEIN" }] };
    const title = `${r.title} — NEUROMEIN | Андрей Майнгардт`;
    return {
      meta: [
        { title },
        { name: "description", content: r.short },
        { property: "og:title", content: title },
        { property: "og:description", content: r.short },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://neuromein.ru/research/${r.slug}` },
        { property: "og:image", content: `https://neuromein.ru${r.cover}` },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: r.title,
            author: { "@type": "Person", name: "Андрей Майнгардт" },
            datePublished: r.date,
            description: r.short,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl font-medium text-text-primary">Исследование не найдено</h1>
        <Link to="/research" className="mt-6 inline-block text-brand">
          ← Все исследования
        </Link>
      </div>
    </Layout>
  ),
  component: ResearchPage,
});

function ResearchPage() {
  const { item: r } = Route.useLoaderData();
  const other = RESEARCH.find((x) => x.slug !== r.slug);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  return (
    <Layout>
      <div className="max-w-[1320px] mx-auto pb-20">
        {/* HERO — журнальная вёрстка */}
        <article
          className="relative overflow-hidden rounded-[20px] noise-overlay"
          style={{
            background: "linear-gradient(180deg, #0e0e16 0%, #08080d 100%)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="aurora-bg" aria-hidden />

          <div className="relative z-10 px-6 lg:px-14 py-14 lg:py-20">
            <FadeIn>
              <nav className="font-mono-meta text-[11px] uppercase flex items-center gap-2 flex-wrap" style={{ color: "#5a5a6a", letterSpacing: "0.16em" }}>
                <Link to="/" className="hover:text-text-secondary transition-colors">
                  Главная
                </Link>
                <span aria-hidden style={{ color: "#2a2a35" }}>/</span>
                <Link to="/research" className="hover:text-text-secondary transition-colors">
                  Исследования
                </Link>
                <span aria-hidden style={{ color: "#2a2a35" }}>/</span>
                <span style={{ color: "#9a9aaa" }}>{r.eyebrow}</span>
              </nav>
            </FadeIn>

            <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 lg:gap-20 items-start">
              {/* Обложка — лежит на столе */}
              <FadeIn delay={0.05}>
                <div
                  className="overflow-hidden rounded-[12px] mx-auto lg:mx-0"
                  style={{
                    maxWidth: 380,
                    aspectRatio: "1 / 1.414",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "#0a0a10",
                    boxShadow:
                      "0 50px 100px -30px rgba(0,0,0,0.85), 0 20px 40px -15px rgba(0,0,0,0.5)",
                    transform: "rotate(-1.2deg)",
                  }}
                >
                  <img
                    src={r.cover}
                    alt={`Обложка: ${r.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeIn>

              {/* Заголовок и метаданные */}
              <div>
                <FadeIn delay={0.08}>
                  <div
                    className="font-mono-meta text-[11px] uppercase flex items-center gap-3"
                    style={{ color: "#7a7a8a", letterSpacing: "0.18em" }}
                  >
                    <span>{r.eyebrow}</span>
                    <span aria-hidden style={{ color: "#2a2a35" }}>·</span>
                    <span>{r.year}</span>
                  </div>
                  <h1
                    className="font-display-serif mt-6 max-w-[18ch]"
                    style={{
                      fontSize: "clamp(44px, 6vw, 80px)",
                      lineHeight: 1.0,
                      color: "#f0f0f5",
                    }}
                  >
                    {r.title}
                  </h1>
                  {r.subtitle && (
                    <p
                      className="mt-6 max-w-[560px]"
                      style={{
                        fontSize: 19,
                        lineHeight: 1.45,
                        color: "#9a9aaa",
                        fontStyle: "italic",
                        fontFamily: "var(--font-serif)",
                      }}
                    >
                      {r.subtitle}
                    </p>
                  )}
                </FadeIn>

                <FadeIn delay={0.14}>
                  <div
                    className="mt-8 font-mono-meta text-[11px] uppercase flex items-center gap-3 flex-wrap"
                    style={{ color: "#5a5a6a", letterSpacing: "0.14em" }}
                  >
                    <span>{r.date}</span>
                    <span aria-hidden style={{ color: "#2a2a35" }}>—</span>
                    <span>Андрей Майнгардт</span>
                    <span aria-hidden style={{ color: "#2a2a35" }}>—</span>
                    <span>{r.pages} стр.</span>
                  </div>
                </FadeIn>

                {/* CTA */}
                <FadeIn delay={0.2}>
                  <div className="mt-10 flex flex-wrap gap-4 items-center">
                    <a
                      href="#read"
                      className="inline-flex items-center gap-2 h-12 px-6 rounded-[10px] text-[14px] font-medium transition-all"
                      style={{
                        background: "var(--brand)",
                        color: "#08080d",
                        boxShadow:
                          "0 12px 36px -10px color-mix(in oklch, var(--brand) 50%, transparent)",
                      }}
                    >
                      Читать на сайте
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                    <a
                      href={r.pdf}
                      download
                      className="font-mono-meta inline-flex items-center gap-2 h-12 px-5 rounded-[10px] text-[12px] uppercase transition-colors hover:text-text-primary"
                      style={{
                        border: "1px solid rgba(255,255,255,0.10)",
                        color: "#9a9aaa",
                        letterSpacing: "0.14em",
                      }}
                    >
                      Скачать PDF
                    </a>
                  </div>
                </FadeIn>

                {/* Краткое содержание — выделенная цитата */}
                <FadeIn delay={0.26}>
                  <div className="mt-12 relative pl-8">
                    <div
                      aria-hidden
                      className="absolute left-0 top-1 bottom-1"
                      style={{
                        width: 2,
                        background:
                          "linear-gradient(180deg, var(--brand), var(--accent-cyan), transparent)",
                      }}
                    />
                    <div className="label-eyebrow mb-4">Краткое содержание</div>
                    <p
                      className="text-[17px] leading-[1.65] max-w-[640px]"
                      style={{ color: "#c5c5d0", fontFamily: "var(--font-serif)", fontSize: 20 }}
                    >
                      {r.summary}
                    </p>
                  </div>
                </FadeIn>

                {/* Оглавление — hairline лист */}
                <FadeIn delay={0.32}>
                  <div className="mt-12">
                    <div className="label-eyebrow mb-6">Оглавление</div>
                    <ol className="list-none">
                      {r.toc.map((t: { id: string; label: string }, idx: number) => (
                        <li
                          key={t.id}
                          className="group flex items-baseline gap-5 py-3 transition-colors"
                          style={{
                            borderTop:
                              idx === 0
                                ? "1px solid rgba(255,255,255,0.06)"
                                : "none",
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <span
                            className="font-mono-meta tabular-nums text-[12px] shrink-0"
                            style={{ color: "#5a5a6a", letterSpacing: "0.1em", width: 32 }}
                          >
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span
                            className="text-[15px] leading-[1.45] transition-colors group-hover:text-text-primary"
                            style={{ color: "#9a9aaa" }}
                          >
                            {t.label}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </article>

        {/* PDF READER */}
        <Reveal>
          <section
            id="read"
            className="mt-6 rounded-[20px] overflow-hidden scroll-mt-28"
            style={{
              background: "linear-gradient(180deg, #0d0d14 0%, #08080d 100%)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              className="flex items-center justify-between gap-4 px-6 lg:px-8 py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="min-w-0">
                <div className="label-eyebrow">Полный текст</div>
                <h2
                  className="mt-2 font-display-serif truncate"
                  style={{ fontSize: 22, color: "#f0f0f5", lineHeight: 1.2 }}
                >
                  {r.title} <span style={{ color: "#5a5a6a" }}>·</span>{" "}
                  <span className="font-mono-meta text-[12px] uppercase" style={{ color: "#7a7a8a", letterSpacing: "0.14em" }}>
                    {r.pages} стр.
                  </span>
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={r.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-meta hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-[8px] text-[11px] uppercase transition-colors"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#9a9aaa",
                    letterSpacing: "0.14em",
                  }}
                >
                  В новой вкладке
                </a>
                <a
                  href={r.pdf}
                  download
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[8px] text-[13px] font-medium"
                  style={{
                    background: "var(--brand)",
                    color: "#08080d",
                    boxShadow: "0 8px 24px -8px color-mix(in oklch, var(--brand) 40%, transparent)",
                  }}
                >
                  Скачать PDF
                </a>
              </div>
            </div>

            {isClient ? (
              <Suspense
                fallback={
                  <div
                    className="bg-[#0a0a10] flex items-center justify-center"
                    style={{ height: "min(85vh, 1100px)" }}
                  >
                    <div className="text-text-tertiary text-[13px]">Загрузка PDF…</div>
                  </div>
                }
              >
                <PdfReader file={r.pdf} title={r.title} />
              </Suspense>
            ) : (
              <div
                className="bg-[#0a0a10] flex items-center justify-center"
                style={{ height: "min(85vh, 1100px)" }}
              >
                <div className="text-text-tertiary text-[13px]">Загрузка PDF…</div>
              </div>
            )}

            <div
              className="px-6 lg:px-8 py-4 text-[12px]"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "#5a5a6a" }}
            >
              Если PDF не отображается, воспользуйтесь кнопкой «Скачать PDF» выше.
            </div>
          </section>
        </Reveal>

        {other && (
          <Reveal>
            <Link
              to="/research/$slug"
              params={{ slug: other.slug }}
              className="block group mt-6 rounded-[20px] p-8 lg:p-10 transition-all duration-400"
              style={{
                background: "linear-gradient(180deg, #0e0e16 0%, #08080d 100%)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(74,158,245,0.30)";
                el.style.boxShadow = "0 24px 80px -20px rgba(74,158,245,0.15)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.05)";
                el.style.boxShadow = "none";
              }}
            >
              <div className="flex items-start gap-7">
                <div
                  className="shrink-0 overflow-hidden rounded-[8px] hidden sm:block"
                  style={{
                    width: 96,
                    height: 134,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "#0a0a10",
                    boxShadow: "0 20px 40px -15px rgba(0,0,0,0.6)",
                  }}
                >
                  <img
                    src={other.cover}
                    alt={other.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="label-eyebrow">
                    Связанные материалы · {other.eyebrow}
                  </div>
                  <h3
                    className="font-display-serif mt-4"
                    style={{ fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.1, color: "#f0f0f5" }}
                  >
                    {other.title}
                  </h3>
                  <p
                    className="mt-3 text-[15px] leading-[1.6] max-w-[640px]"
                    style={{ color: "#9a9aaa" }}
                  >
                    {other.short}
                  </p>
                  <div className="mt-6">
                    <ArrowLink>Читать</ArrowLink>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        )}
      </div>
    </Layout>
  );
}
