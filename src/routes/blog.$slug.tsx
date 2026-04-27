import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/Reveal";
import { Pill } from "@/components/ui-bits";
import { fetchPublicationBySlug } from "@/data/publications.fetch";

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
        <article className="rounded-[24px] border-[0.5px] border-border bg-bg-reading">
          <div className="max-w-[760px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
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
              <h1 className="mt-6 text-[36px] sm:text-[48px] font-medium text-text-primary leading-[1.05] tracking-[-0.02em]">
                {p.title}
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="reading-content mt-12">
                {p.body
                  ? p.body
                      .split(/\n\n+/)
                      .map((para, i) => (
                        <p key={i} style={{ whiteSpace: "pre-line" }}>
                          {para}
                        </p>
                      ))
                  : (
                    <>
                      <p>{p.excerpt}</p>
                      <p>
                        Если вы хотите следить за обновлениями, подпишитесь на{" "}
                        <a href="https://t.me/neuromein" target="_blank" rel="noreferrer">
                          Telegram-канал
                        </a>
                        .
                      </p>
                    </>
                  )}
                {p.telegramUrl && (
                  <p>
                    <a href={p.telegramUrl} target="_blank" rel="noreferrer">
                      Читать оригинал в Telegram →
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
