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
  return (
    <Layout>
      <div className="max-w-[1320px] mx-auto pb-20">
        <article>
          <div className="max-w-[820px] mx-auto px-2 sm:px-6 lg:px-10 py-10 lg:py-18">
            <FadeIn>
              <nav className="text-[13px] text-text-tertiary flex items-center gap-2 flex-wrap">
                <Link to="/" className="hover:text-text-secondary transition-colors">
                  Главная
                </Link>
                <span aria-hidden>/</span>
                <Link to="/blog" className="hover:text-text-secondary transition-colors">
                  Публикации
                </Link>
                <span aria-hidden>/</span>
                <span className="text-text-secondary">{p.title}</span>
              </nav>
            </FadeIn>

            <FadeIn delay={0.06}>
              <div className="mt-8 flex items-center gap-3 flex-wrap">
                <span className="text-[13px] text-text-tertiary">{p.dateLabel}</span>
                <Pill>{p.tag}</Pill>
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <h1 className="mt-6 text-[40px] sm:text-[56px] lg:text-[68px] font-medium text-text-primary leading-[1.02] tracking-[-0.025em]">
                {p.title}
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="reading-content mt-12 border-t border-border pt-10">
                {p.body && p.body.trim().length > 0 ? (
                  p.body
                    .split(/\n\n+/)
                    .map((para, i) => (
                      <p key={i} style={{ whiteSpace: "pre-line" }}>
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
                {p.telegramUrl && (
                  <p className="pt-6">
                    <a
                      href={p.telegramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="not-prose inline-flex items-center gap-2 rounded-full border-[0.5px] border-border-strong bg-bg-card/70 px-4 py-2 text-[13px] font-medium text-brand transition-colors hover:border-brand/50 hover:text-text-primary"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M21.95 4.32c.32-1.32-.46-1.86-1.32-1.55L2.78 9.9c-1.27.5-1.25 1.21-.22 1.53l4.62 1.44 10.7-6.74c.5-.33.96-.15.58.18l-8.66 7.83-.34 4.83c.5 0 .72-.22.99-.48l2.37-2.3 4.92 3.63c.9.5 1.55.24 1.78-.83l3.22-15.13z" />
                      </svg>
                      Оригинал в Telegram
                    </a>
                  </p>
                )}
              </div>
            </FadeIn>
          </div>
        </article>
      </div>
    </Layout>
  );
}
