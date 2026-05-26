import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { METHODOLOGY } from "@/data/methodology";

export const Route = createFileRoute("/methodology/$slug")({
  loader: ({ params }) => {
    const item = METHODOLOGY.find((m) => m.slug === params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    const m = loaderData?.item;
    if (!m)
      return { meta: [{ title: "Методология — NEUROMEIN" }] };
    const title = `${m.title} — Методология | NEUROMEIN`;
    return {
      meta: [
        { title },
        { name: "description", content: m.subtitle },
        { property: "og:title", content: title },
        { property: "og:description", content: m.subtitle },
        { property: "og:type", content: "article" },
        {
          property: "og:url",
          content: `https://neuromein.ru/methodology/${m.slug}`,
        },
      ],
      links: [
        { rel: "canonical", href: `https://neuromein.ru/methodology/${m.slug}` },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ScholarlyArticle",
            headline: `${m.title} — модель ИИ-замещения рабочих мест`,
            author: {
              "@type": "Person",
              name: "Андрей Майнгардт",
              url: "https://neuromein.ru/about",
            },
            datePublished: "2026-03-24",
            url: `https://neuromein.ru/methodology/${m.slug}`,
            isPartOf: {
              "@type": "CreativeWork",
              name: "Тихая замена",
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl font-medium text-text-primary">
          Концепция не найдена
        </h1>
        <Link to="/methodology" className="mt-6 inline-block text-brand">
          ← Все концепции
        </Link>
      </div>
    </Layout>
  ),
  errorComponent: ({ error }) => (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl font-medium text-text-primary">Ошибка</h1>
        <p className="mt-4 text-text-secondary">{error.message}</p>
      </div>
    </Layout>
  ),
  component: MethodologyPage,
});

function MethodologyPage() {
  const { item: m } = Route.useLoaderData();
  const idx = METHODOLOGY.findIndex((x) => x.slug === m.slug);
  const next = METHODOLOGY[(idx + 1) % METHODOLOGY.length];

  return (
    <Layout>
      <article className="max-w-[820px] mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <Reveal>
          <Link
            to="/methodology"
            className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Методология
          </Link>

          <div className="label-eyebrow mt-8">
            Концепция · «Тихая замена»
          </div>
          <h1 className="mt-4 text-[36px] lg:text-[52px] font-medium leading-[1.05] tracking-[-0.025em] text-text-primary">
            {m.title}
          </h1>
          <p className="mt-6 text-[18px] lg:text-[20px] leading-[1.5] text-text-secondary">
            {m.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            className="mt-12 p-6 lg:p-8 rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(74,158,245,0.07), rgba(74,158,245,0.02))",
              border: "1px solid rgba(74,158,245,0.18)",
            }}
          >
            <p
              className="text-[16px] lg:text-[17px] leading-[1.65]"
              style={{ color: "#e8e8f0" }}
            >
              {m.definition}
            </p>
          </div>
        </Reveal>

        {m.blocks.map((block: { heading: string; paragraphs: string[] }, i: number) => (
          <Reveal key={block.heading} delay={0.05 + i * 0.05}>
            <section className="mt-14 lg:mt-16">
              <h2 className="text-[24px] lg:text-[28px] font-medium leading-[1.2] tracking-[-0.02em] text-text-primary">
                {block.heading}
              </h2>
              <div className="mt-5 space-y-5">
                {block.paragraphs.map((p: string, k: number) => (
                  <p
                    key={k}
                    className="text-[16px] lg:text-[17px] leading-[1.7]"
                    style={{ color: "#c8c8d4" }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>
          </Reveal>
        ))}

        {m.slug === "pyramid-to-barbell" && (
          <Reveal delay={0.2}>
            <section className="mt-14 lg:mt-16">
              <h2 className="text-[20px] lg:text-[22px] font-medium text-text-primary">
                Визуализация
              </h2>
              <div
                className="mt-6 p-8 lg:p-12 rounded-xl flex items-center justify-around gap-8"
                style={{
                  background: "#0c0c12",
                  border: "1px solid #1c1c28",
                }}
              >
                <PyramidSvg />
                <ArrowSvg />
                <BarbellSvg />
              </div>
              <div className="mt-3 flex items-center justify-around text-[12px] uppercase tracking-wider text-text-secondary">
                <span>Было: пирамида</span>
                <span />
                <span>Стало: гантель</span>
              </div>
            </section>
          </Reveal>
        )}

        <Reveal delay={0.3}>
          <div
            className="mt-16 p-6 rounded-xl text-[14px] leading-[1.6]"
            style={{
              background: "#0c0c12",
              border: "1px solid #1c1c28",
              color: "#9a9aaa",
            }}
          >
            Концепция «{m.title}» разработана Андреем Майнгардтом. Подробнее - в
            исследовании «Тихая замена» ({m.chapter}).{" "}
            <Link
              to="/research/$slug"
              params={{ slug: "silent-replacement" }}
              className="text-brand hover:underline"
            >
              Читать исследование →
            </Link>
          </div>
        </Reveal>

        {next && next.slug !== m.slug && (
          <Reveal delay={0.35}>
            <div className="mt-12">
              <Link
                to="/methodology/$slug"
                params={{ slug: next.slug }}
                className="block group"
              >
                <div
                  className="p-6 rounded-xl transition-all"
                  style={{
                    background: "#0c0c12",
                    border: "1px solid #1c1c28",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(74,158,245,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "#1c1c28";
                  }}
                >
                  <span className="text-[11px] uppercase tracking-wider text-text-secondary">
                    Следующая концепция →
                  </span>
                  <div className="mt-2 text-[20px] font-medium text-text-primary">
                    {next.title}
                  </div>
                </div>
              </Link>
            </div>
          </Reveal>
        )}
      </article>
    </Layout>
  );
}

function PyramidSvg() {
  return (
    <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
      <polygon
        points="60,10 110,130 10,130"
        stroke="#4a9ef5"
        strokeWidth="1.5"
        fill="rgba(74,158,245,0.08)"
      />
      <line x1="30" y1="80" x2="90" y2="80" stroke="#2a2a35" strokeWidth="1" />
      <line x1="20" y1="105" x2="100" y2="105" stroke="#2a2a35" strokeWidth="1" />
    </svg>
  );
}

function BarbellSvg() {
  return (
    <svg width="160" height="140" viewBox="0 0 160 140" fill="none">
      <rect
        x="10"
        y="20"
        width="36"
        height="100"
        rx="6"
        stroke="#4a9ef5"
        strokeWidth="1.5"
        fill="rgba(74,158,245,0.08)"
      />
      <rect
        x="46"
        y="65"
        width="68"
        height="10"
        fill="#2a2a35"
      />
      <rect
        x="114"
        y="20"
        width="36"
        height="100"
        rx="6"
        stroke="#4a9ef5"
        strokeWidth="1.5"
        fill="rgba(74,158,245,0.08)"
      />
    </svg>
  );
}

function ArrowSvg() {
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
      <line x1="0" y1="10" x2="50" y2="10" stroke="#5a5a6a" strokeWidth="1.5" />
      <polyline
        points="44,4 54,10 44,16"
        stroke="#5a5a6a"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}