import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { PredictionsTimeline } from "@/components/PredictionsTimeline";
import { PredictionsHero } from "@/components/PredictionsHero";
import { PredictionsTrackRecord } from "@/components/PredictionsTrackRecord";
import { predictions, getStats, STATUS_LABELS, SOURCE_LABELS } from "@/data/predictions";

const PAGE_URL = "https://neuromein.ru/predictions";
const PAGE_TITLE = "Прогнозы и их проверка — NEUROMEIN | Андрей Майнгардт";
const PAGE_DESC =
  "Публичный prediction tracker: фиксированные прогнозы Андрея Майнгардта о развитии ИИ и рынка труда с проверкой по срокам без правок задним числом.";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: "Прогнозы и их проверка — NEUROMEIN" },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:url", content: PAGE_URL },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: PAGE_URL },
      {
        rel: "alternate",
        type: "application/json",
        href: "/api/predictions.json",
        title: "NEUROMEIN Prediction Tracker (JSON)",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildJsonLd()),
      },
    ],
  }),
  component: PredictionsPage,
});

function buildJsonLd() {
  const stats = getStats(predictions);
  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "NEUROMEIN Public Prediction Tracker",
    description:
      "Публичный трекер проверяемых прогнозов Андрея Майнгардта об ИИ и рынке труда на горизонт 2026–2028.",
    url: PAGE_URL,
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: [
      "AI predictions",
      "labor market",
      "AI forecast 2026",
      "Андрей Майнгардт",
      "Тихая замена",
    ],
    creator: {
      "@type": "Person",
      name: "Андрей Майнгардт",
      url: "https://neuromein.ru/about",
      jobTitle: "AI-стратег, аналитик",
    },
    isAccessibleForFree: true,
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: "https://neuromein.ru/api/predictions.json",
      },
    ],
    variableMeasured: [
      "id",
      "title",
      "statement",
      "date_made",
      "target_horizon",
      "status",
      "evidence",
    ],
    dateModified: new Date().toISOString().slice(0, 10),
    measurementTechnique:
      "Прогнозы зафиксированы датой публикации в исходных исследованиях. Статусы обновляются 1 числа каждого месяца. Точность = (fulfilled + 0.5 * partial) / settled.",
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://neuromein.ru/" },
      { "@type": "ListItem", position: 2, name: "Прогнозы", item: PAGE_URL },
    ],
  };

  const claimReviews = predictions.map((p) => ({
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    url: `${PAGE_URL}#${p.id}`,
    datePublished: p.date_made,
    reviewRating: {
      "@type": "Rating",
      ratingValue:
        p.status === "fulfilled" ? 5 : p.status === "partial" ? 3 : p.status === "not_fulfilled" ? 1 : 0,
      bestRating: 5,
      worstRating: 0,
      alternateName: STATUS_LABELS[p.status],
    },
    author: {
      "@type": "Person",
      name: "Андрей Майнгардт",
      url: "https://neuromein.ru/about",
    },
    claimReviewed: p.title,
    itemReviewed: {
      "@type": "Claim",
      author: { "@type": "Person", name: "Андрей Майнгардт" },
      datePublished: p.date_made,
      appearance: {
        "@type": "CreativeWork",
        name: SOURCE_LABELS[p.source.work],
        url:
          p.source.work === "silent-replacement"
            ? "https://neuromein.ru/research/silent-replacement"
            : "https://neuromein.ru/research/ai-2025-forecast",
      },
      text: p.statement,
    },
  }));

  return [dataset, breadcrumbs, ...claimReviews];
}

function PredictionsPage() {
  const stats = useMemo(() => getStats(predictions), []);

  return (
    <Layout>
      <div className="max-w-[1320px] mx-auto pb-24 pt-4 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs — semantic + visible */}
        <nav
          aria-label="Хлебные крошки"
          className="pt-4 text-[12.5px] text-text-tertiary tracking-[-0.005em]"
        >
          <ol className="flex items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-text-secondary transition-colors">
                Главная
              </Link>
            </li>
            <li aria-hidden className="text-text-tertiary/50">
              ›
            </li>
            <li className="text-text-secondary" aria-current="page">
              Прогнозы
            </li>
          </ol>
        </nav>

        {/* Editorial hero */}
        <PredictionsHero stats={stats} />

        {/* Main content — interactive timeline + filters + cards */}
        <PredictionsTimeline />

        {/* Track Record — Stratechery-style commitment section */}
        <Reveal>
          <PredictionsTrackRecord stats={stats} />
        </Reveal>
      </div>
    </Layout>
  );
}
