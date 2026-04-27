import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/HeroCard";
import { Reveal } from "@/components/Reveal";
import { PublicationsList } from "@/components/PublicationsList";
import {
  fetchPublications,
  type Publication,
} from "@/data/publications.fetch";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Публикации — NEUROMEIN | Андрей Майнгардт" },
      {
        name: "description",
        content:
          "Аналитические заметки, разборы событий и мнения Андрея Майнгардта о рынке ИИ и трансформации работы.",
      },
      { property: "og:title", content: "Публикации — NEUROMEIN" },
      {
        property: "og:description",
        content: "Аналитические заметки и разборы об ИИ и рынке труда.",
      },
      { property: "og:url", content: "https://neuromein.ru/blog" },
    ],
  }),
  loader: () => fetchPublications(),
  component: BlogPage,
  errorComponent: ({ error }) => (
    <Layout>
      <div className="max-w-[1320px] mx-auto py-20 text-center text-text-secondary">
        Не удалось загрузить публикации: {error.message}
      </div>
    </Layout>
  ),
});

function BlogPage() {
  const initial = Route.useLoaderData() as Publication[];
  const [items, setItems] = useState<Publication[]>(initial);

  // Realtime: re-fetch on any change to publications
  useEffect(() => {
    let cancelled = false;
    const refetch = async () => {
      try {
        const next = await fetchPublications();
        if (!cancelled) setItems(next);
      } catch (e) {
        console.error("publications refetch failed", e);
      }
    };
    const channel = supabase
      .channel("publications-public-blog")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "publications" },
        refetch,
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Layout>
      <div className="max-w-[1320px] mx-auto pb-20">
        <PageHero
          eyebrow="Заметки и разборы"
          title="Публикации"
          description="Аналитические заметки, разборы событий и мнения о развитии ИИ и его влиянии на рынок труда."
        />

        {items.length === 0 ? (
          <Reveal>
            <div className="mt-6 rounded-[24px] border-[0.5px] border-border bg-bg-card/40 p-10 lg:p-14 flex flex-col items-start gap-6">
              <p className="text-[16px] text-text-secondary leading-[1.7] max-w-[640px]">
                Раздел наполняется. Первые публикации появятся в ближайшее время.
                Следите за обновлениями в Telegram-канале NEUROMEIN.
              </p>
              <a
                href="https://t.me/neuromein"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center h-[44px] px-6 rounded-[8px] text-[14px] font-medium transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
                style={{ background: "#f0f0f5", color: "#08080D" }}
              >
                Подписаться на Telegram →
              </a>
            </div>
          </Reveal>
        ) : (
          <PublicationsList items={items} />
        )}
      </div>
    </Layout>
  );
}
