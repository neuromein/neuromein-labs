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
        <article className="rounded-[24px] border-[0.5px] border-border bg-bg-reading">
          <div className="max-w-[760px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
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

            <FadeIn delay={0.05}>
              <div className="mt-10 flex items-center gap-3 flex-wrap">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: r.dotColor }}
                  aria-hidden
                />
                <span className="label-eyebrow">{r.eyebrow} · {r.year}</span>
              </div>
              <h1 className="mt-4 text-[40px] sm:text-[56px] font-medium text-text-primary leading-[1.02] tracking-[-0.025em]">
                {r.title}
              </h1>
            </FadeIn>

            <FadeIn delay={0.12}>
              <div className="mt-6 text-[13px] text-text-tertiary flex items-center gap-3 flex-wrap">
                <span>{r.date}</span>
                <span aria-hidden className="text-border-strong">·</span>
                <span>Андрей Майнгардт</span>
                <span aria-hidden className="text-border-strong">·</span>
                <span>{r.readTime}</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.18}>
              <div className="mt-12 rounded-[20px] bg-bg-card/70 p-7 lg:p-8 border-[0.5px] border-border">
                <div className="label-eyebrow mb-3">Краткое содержание</div>
                <p className="text-[15px] text-text-secondary leading-[1.7]">{r.summary}</p>
              </div>
            </FadeIn>

            <Reveal delay={0.05}>
              <div className="mt-14 grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-10">
                <aside className="lg:sticky lg:top-28 self-start">
                  <div className="label-eyebrow mb-4">Оглавление</div>
                  <ul className="space-y-2.5">
                    {r.toc.map((t: { id: string; label: string }) => (
                      <li key={t.id}>
                        <a
                          href={`#${t.id}`}
                          className="text-[13px] text-text-secondary hover:text-brand transition-colors"
                        >
                          {t.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </aside>

                <div className="reading-content">
                  {r.toc.map((t: { id: string; label: string }) => (
                    <section key={t.id} id={t.id}>
                      <h2>{t.label}</h2>
                      <p>
                        [Текст исследования будет добавлен позже] Этот раздел посвящён
                        теме «{t.label.toLowerCase()}» и будет опубликован в полной
                        версии материала.
                      </p>
                      <p>
                        Здесь будут представлены данные, графики и аналитические
                        выводы.
                      </p>
                    </section>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </article>

        {other && (
          <Reveal>
            <Link
              to="/research/$slug"
              params={{ slug: other.slug }}
              className="block group mt-4 rounded-[24px] border-[0.5px] border-border bg-bg-card/40 p-8 lg:p-10 hover:border-border-strong hover:bg-bg-card/60 transition-colors duration-300"
            >
              <div className="label-eyebrow">Связанные материалы · {other.eyebrow}</div>
              <h3 className="mt-3 text-[24px] font-medium text-text-primary tracking-tight">
                {other.title}
              </h3>
              <p className="mt-2 text-[14px] text-text-secondary max-w-[640px]">{other.short}</p>
              <div className="mt-5">
                <ArrowLink>Читать</ArrowLink>
              </div>
            </Link>
          </Reveal>
        )}
      </div>
    </Layout>
  );
}
