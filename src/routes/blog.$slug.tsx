import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/Reveal";
import { Pill } from "@/components/ui-bits";
import { fetchPublicationBySlug } from "@/data/publications.fetch";

/**
 * Convert plain text into React nodes with auto-linked URLs.
 * Detects http(s)://, t.me/, and bare www.* links.
 */
function linkify(text: string): React.ReactNode[] {
  const re = /(https?:\/\/[^\s)]+|t\.me\/[^\s)]+|www\.[^\s)]+)/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const raw = m[0];
    const href = raw.startsWith("http")
      ? raw
      : raw.startsWith("t.me/")
        ? `https://${raw}`
        : `https://${raw}`;
    out.push(
      <a
        key={`lnk-${i++}`}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {raw}
      </a>,
    );
    last = m.index + raw.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const item = await fetchPublicationBySlug(params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.item;
    if (!p) return { meta: [{ title: "Публикация — NEUROMEIN" }] };
    const title = `${p.title} — NEUROMEIN | Андрей Майнгардт`;
    return {
      meta: [
        { title },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: title },
        { property: "og:description", content: p.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://neuromein.ru/blog/${p.slug}` },
      ],
      links: [
        { rel: "canonical", href: `https://neuromein.ru/blog/${p.slug}` },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            description: p.excerpt,
            datePublished: p.publishedAt,
            author: {
              "@type": "Person",
              name: "Андрей Майнгардт",
              url: "https://neuromein.ru/about",
            },
            publisher: {
              "@type": "Organization",
              name: "NEUROMEIN",
              url: "https://neuromein.ru",
            },
            mainEntityOfPage: `https://neuromein.ru/blog/${p.slug}`,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl font-medium text-text-primary">Публикация не найдена</h1>
        <Link to="/blog" className="mt-6 inline-block text-brand">
          ← Все публикации
        </Link>
      </div>
    </Layout>
  ),
  errorComponent: ({ error }) => (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center text-text-secondary">
        Не удалось загрузить публикацию: {error.message}
      </div>
    </Layout>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { item: p } = Route.useLoaderData();
  const paragraphs = p.body.trim().length > 0
    ? p.body.trim().split(/\n{2,}/).filter((para: string) => para.trim().length > 0)
    : [];

  return (
    <Layout>
      <article className="mx-auto max-w-[1180px] pb-24">
        <div className="px-0 sm:px-6 lg:px-10">
          <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16 lg:py-14">
            <div className="min-w-0">
            <FadeIn>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-text-tertiary transition-colors hover:text-text-primary"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Все публикации
              </Link>
            </FadeIn>

            <FadeIn delay={0.06}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Pill>{p.tag}</Pill>
                <span className="text-[13px] text-text-tertiary">{p.dateLabel}</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <h1 className="mt-6 max-w-[920px] text-[38px] font-medium leading-[1.05] text-text-primary sm:text-[56px] lg:text-[72px]">
                {p.title}
              </h1>
            </FadeIn>
            </div>

            {p.telegramUrl && (
              <FadeIn delay={0.14}>
                <aside className="lg:sticky lg:top-32 lg:self-start">
                  <a
                    href={p.telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full border-[0.5px] border-border-strong bg-bg-card/70 px-5 text-[13px] font-medium text-brand transition-colors hover:border-brand/50 hover:text-text-primary"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M21.95 4.32c.32-1.32-.46-1.86-1.32-1.55L2.78 9.9c-1.27.5-1.25 1.21-.22 1.53l4.62 1.44 10.7-6.74c.5-.33.96-.15.58.18l-8.66 7.83-.34 4.83c.5 0 .72-.22.99-.48l2.37-2.3 4.92 3.63c.9.5 1.55.24 1.78-.83l3.22-15.13z" />
                    </svg>
                    Читать в Telegram
                  </a>
                </aside>
              </FadeIn>
            )}
          </div>

            <FadeIn delay={0.2}>
            <div className="border-t border-border pt-10 lg:pt-14">
              <div className="reading-content mx-auto max-w-[760px]">
                {paragraphs.length > 0 ? (
                  paragraphs.map((para: string, i: number) => (
                    <p
                      key={i}
                      className={i === 0 ? "text-[19px] leading-[1.75] text-text-primary sm:text-[21px]" : undefined}
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {linkify(para)}
                    </p>
                  ))
                ) : (
                  <>
                    {p.excerpt && <p>{p.excerpt}</p>}
                    <p>
                      Полный текст публикации скоро появится здесь. Пока вы можете
                      прочитать оригинал в{" "}
                      <a href={p.telegramUrl ?? "https://t.me/neuromein"} target="_blank" rel="noreferrer">
                        Telegram-канале
                      </a>
                      .
                    </p>
                  </>
                )}
              </div>
            </div>
            </FadeIn>
        </div>
      </article>
    </Layout>
  );
}
