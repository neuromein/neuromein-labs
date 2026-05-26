import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ArrowLeft, ExternalLink, MapPin, Calendar as CalIcon } from "lucide-react";
import { fetchSpeakingBySlug } from "@/data/speaking.fetch";

export const Route = createFileRoute("/speaking/$slug")({
  loader: async ({ params }) => {
    const item = await fetchSpeakingBySlug(params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.item;
    if (!p) return { meta: [{ title: "Выступление — NEUROMEIN" }] };
    const title = `${p.organization} — NEUROMEIN`;
    const description = p.caption || p.description.slice(0, 160);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:image", content: p.imageUrl },
        { property: "og:url", content: `https://neuromein.ru/speaking/${p.slug}` },
      ],
      links: [
        { rel: "canonical", href: `https://neuromein.ru/speaking/${p.slug}` },
      ],
    };
  },
  notFoundComponent: () => (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl font-medium text-text-primary">Выступление не найдено</h1>
        <Link to="/" className="mt-6 inline-block text-brand">← На главную</Link>
      </div>
    </Layout>
  ),
  errorComponent: ({ error }) => (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center text-text-secondary">
        Не удалось загрузить: {error.message}
      </div>
    </Layout>
  ),
  component: SpeakingDetailPage,
});

function SpeakingDetailPage() {
  const { item } = Route.useLoaderData();

  // Split description into paragraphs by blank lines
  const paragraphs = item.description
    .split(/\n{2,}/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <Layout>
      <article className="max-w-[920px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft size={14} /> На главную
        </Link>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 text-[12.5px] text-text-tertiary uppercase tracking-wide">
          <span className="inline-flex items-center h-6 px-2.5 rounded-full border border-border-strong bg-bg-card/60 text-text-secondary normal-case tracking-normal text-[11.5px]">
            {item.role}
          </span>
          {item.dateLabel && (
            <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
              <CalIcon size={13} /> {item.dateLabel}
            </span>
          )}
          {item.location && (
            <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
              <MapPin size={13} /> {item.location}
            </span>
          )}
        </div>

        <h1 className="text-[32px] sm:text-[48px] lg:text-[60px] font-medium leading-[1.05] tracking-[-0.025em] text-text-primary mb-8">
          {item.organization}
        </h1>

        {item.caption && (
          <p className="text-[19px] sm:text-[21px] leading-[1.5] text-text-secondary mb-10 max-w-[760px]">
            {item.caption}
          </p>
        )}

        {/* Hero image */}
        <div
          className="relative w-full overflow-hidden rounded-[20px] border border-border bg-bg-deep mb-12"
          style={{ aspectRatio: "16 / 10" }}
        >
          <img
            src={item.imageUrl}
            alt={item.organization}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description body */}
        {paragraphs.length > 0 && (
          <div className="max-w-[720px] mx-auto">
            {paragraphs.map((p: string, i: number) => (
              <p
                key={i}
                className="text-[17px] sm:text-[18px] leading-[1.78] text-text-primary/90 mb-6 whitespace-pre-wrap"
              >
                {p}
              </p>
            ))}
          </div>
        )}

        {item.externalUrl && (
          <div className="max-w-[720px] mx-auto mt-10 pt-8 border-t border-border">
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-bg-card hover:bg-bg-card/80 border border-border-strong text-text-primary text-[14px] transition-colors"
            >
              <ExternalLink size={15} /> Смотреть материал
            </a>
          </div>
        )}
      </article>
    </Layout>
  );
}