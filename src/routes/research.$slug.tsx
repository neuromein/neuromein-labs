import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Reveal, FadeIn } from "@/components/Reveal";
import { ArrowLink } from "@/components/ui-bits";
import { RESEARCH } from "@/lib/site";

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

  return (
    <Layout>
      <div className="max-w-[1320px] mx-auto pb-20">
        {/* HERO с обложкой и метаданными */}
        <article className="rounded-[24px] border-[0.5px] border-border bg-bg-reading overflow-hidden">
          <div className="px-6 lg:px-12 py-16 lg:py-20">
            <FadeIn>
              <nav className="text-[13px] text-text-tertiary flex items-center gap-2 flex-wrap">
                <Link to="/" className="hover:text-text-secondary transition-colors">
                  Главная
                </Link>
                <span aria-hidden>/</span>
                <Link to="/research" className="hover:text-text-secondary transition-colors">
                  Исследования
                </Link>
                <span aria-hidden>/</span>
                <span className="text-text-secondary">{r.title}</span>
              </nav>
            </FadeIn>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-14 items-start">
              {/* Обложка */}
              <FadeIn delay={0.05}>
                <div
                  className="overflow-hidden rounded-[12px] mx-auto lg:mx-0"
                  style={{
                    maxWidth: 280,
                    aspectRatio: "1 / 1.414",
                    border: "1px solid #1c1c28",
                    background: "#0a0a10",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
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
                  <span className="label-eyebrow">{r.eyebrow} · {r.year}</span>
                  <h1 className="mt-4 text-[40px] sm:text-[52px] font-medium text-text-primary leading-[1.02] tracking-[-0.025em]">
                    {r.title}
                  </h1>
                  {r.subtitle && (
                    <p className="mt-4 text-[18px] text-text-secondary leading-[1.4] max-w-[560px]">
                      {r.subtitle}
                    </p>
                  )}
                </FadeIn>

                <FadeIn delay={0.12}>
                  <div className="mt-6 text-[13px] text-text-tertiary flex items-center gap-3 flex-wrap">
                    <span>{r.date}</span>
                    <span aria-hidden className="text-border-strong">·</span>
                    <span>Андрей Майнгардт</span>
                    <span aria-hidden className="text-border-strong">·</span>
                    <span>{r.pages} стр.</span>
                  </div>
                </FadeIn>

                {/* CTA */}
                <FadeIn delay={0.16}>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="#read"
                      className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-[14px] font-medium transition-colors"
                      style={{
                        background: "var(--brand)",
                        color: "#0a0a10",
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
                      className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-[14px] font-medium border-[0.5px] border-border-strong text-text-primary hover:bg-bg-card/60 transition-colors"
                    >
                      Скачать PDF
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M8 2v9M4 7l4 4 4-4M3 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                </FadeIn>

                {/* Краткое содержание */}
                <FadeIn delay={0.2}>
                  <div className="mt-10 rounded-[16px] bg-bg-card/60 p-6 lg:p-7 border-[0.5px] border-border">
                    <div className="label-eyebrow mb-3">Краткое содержание</div>
                    <p className="text-[15px] text-text-secondary leading-[1.7]">{r.summary}</p>
                  </div>
                </FadeIn>

                {/* Оглавление */}
                <FadeIn delay={0.24}>
                  <div className="mt-8">
                    <div className="label-eyebrow mb-4">Оглавление</div>
                    <ol className="space-y-2.5 list-none">
                      {r.toc.map((t: { id: string; label: string }, idx: number) => (
                        <li
                          key={t.id}
                          className="text-[14px] text-text-secondary leading-[1.5] flex gap-3"
                        >
                          <span className="text-text-tertiary tabular-nums w-6 shrink-0">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span>{t.label}</span>
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
            className="mt-4 rounded-[24px] border-[0.5px] border-border bg-bg-card/40 overflow-hidden scroll-mt-28"
          >
            <div className="flex items-center justify-between gap-4 px-6 lg:px-8 py-5 border-b border-border">
              <div className="min-w-0">
                <div className="label-eyebrow">Полный текст</div>
                <h2 className="mt-1 text-[18px] text-text-primary truncate">
                  {r.title} · {r.pages} стр.
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={r.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] text-text-secondary hover:text-text-primary border-[0.5px] border-border-strong transition-colors"
                >
                  Открыть в новой вкладке
                </a>
                <a
                  href={r.pdf}
                  download
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-medium"
                  style={{ background: "var(--brand)", color: "#0a0a10" }}
                >
                  Скачать PDF
                </a>
              </div>
            </div>

            {/* Desktop / planshet: встроенный PDF-вьюер */}
            <div
              className="hidden md:block bg-[#0a0a10] relative"
              style={{ height: "min(85vh, 1100px)" }}
            >
              <object
                data={`${r.pdf}#view=FitH&toolbar=1&navpanes=0`}
                type="application/pdf"
                className="w-full h-full"
                style={{ border: 0 }}
              >
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <div className="label-eyebrow mb-3">PDF не открылся в браузере</div>
                    <p className="text-[14px] text-text-secondary mb-6 leading-[1.6]">
                      Ваш браузер не отобразил встроенный просмотр.
                      Откройте PDF в новой вкладке или скачайте его на устройство.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <a
                        href={r.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-[14px] font-medium border-[0.5px] border-border-strong text-text-primary hover:bg-bg-card/60 transition-colors"
                      >
                        Открыть в новой вкладке
                      </a>
                      <a
                        href={r.pdf}
                        download
                        className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-[14px] font-medium"
                        style={{ background: "var(--brand)", color: "#0a0a10" }}
                      >
                        Скачать PDF
                      </a>
                    </div>
                  </div>
                </div>
              </object>
            </div>

            {/* Mobile: PDF inline не работает в iOS/Android Chrome — показываем CTA */}
            <div className="md:hidden bg-[#0a0a10] px-6 py-12">
              <div className="text-center max-w-sm mx-auto">
                <div
                  className="mx-auto mb-5 overflow-hidden rounded-md"
                  style={{
                    width: 100,
                    height: 138,
                    border: "1px solid #1c1c28",
                    background: "#0a0a10",
                  }}
                >
                  <img
                    src={r.cover}
                    alt={r.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[14px] text-text-secondary mb-6 leading-[1.6]">
                  Откройте PDF в браузере или скачайте на устройство — {r.pages} страниц.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={r.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full text-[14px] font-medium"
                    style={{ background: "var(--brand)", color: "#0a0a10" }}
                  >
                    Открыть PDF
                  </a>
                  <a
                    href={r.pdf}
                    download
                    className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full text-[14px] font-medium border-[0.5px] border-border-strong text-text-primary"
                  >
                    Скачать на устройство
                  </a>
                </div>
              </div>
            </div>

            <div className="px-6 lg:px-8 py-4 border-t border-border text-[12px] text-text-tertiary">
              Если PDF не отображается, воспользуйтесь кнопкой «Скачать PDF» выше.
            </div>
          </section>
        </Reveal>

        {other && (
          <Reveal>
            <Link
              to="/research/$slug"
              params={{ slug: other.slug }}
              className="block group mt-4 rounded-[24px] border-[0.5px] border-border bg-bg-card/40 p-8 lg:p-10 hover:border-border-strong hover:bg-bg-card/60 transition-colors duration-300"
            >
              <div className="flex items-start gap-6">
                <div
                  className="shrink-0 overflow-hidden rounded-md hidden sm:block"
                  style={{
                    width: 72,
                    height: 100,
                    border: "1px solid #1c1c28",
                    background: "#0a0a10",
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
                  <div className="label-eyebrow">Связанные материалы · {other.eyebrow}</div>
                  <h3 className="mt-3 text-[24px] font-medium text-text-primary tracking-tight">
                    {other.title}
                  </h3>
                  <p className="mt-2 text-[14px] text-text-secondary max-w-[640px]">{other.short}</p>
                  <div className="mt-5">
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
