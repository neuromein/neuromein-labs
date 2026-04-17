import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader, Pill } from "@/components/ui-bits";
import { Reveal } from "@/components/Reveal";
import { PUBLICATIONS, TAGS } from "@/lib/site";

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
  component: BlogPage,
});

function BlogPage() {
  const [activeTag, setActiveTag] = useState<(typeof TAGS)[number]>("Все");
  const filtered =
    activeTag === "Все" ? PUBLICATIONS : PUBLICATIONS.filter((p) => p.tag === activeTag);

  return (
    <Layout>
      <section className="max-w-[1280px] mx-auto px-5 lg:px-8 pb-16">
        <Reveal>
          <PageHeader
            title="Публикации"
            description="Аналитические заметки, разборы событий и мнения."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap gap-2">
            {TAGS.map((tag) => {
              const active = tag === activeTag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 rounded-full text-[13px] tracking-[0.01em] transition-all duration-200 ${
                    active
                      ? "bg-brand/15 text-brand border-[0.5px] border-brand/30"
                      : "bg-transparent border-[0.5px] border-border text-text-secondary hover:text-text-primary hover:border-border-strong"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-10 border-t border-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTag}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {filtered.length === 0 && (
                <p className="py-12 text-[14px] text-text-tertiary">
                  В этой категории пока нет публикаций.
                </p>
              )}
              {filtered.map((p, i) => (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-6 border-b border-border group"
                  >
                    <span className="text-[13px] text-text-tertiary tabular-nums shrink-0 w-[140px]">
                      {p.dateLabel}
                    </span>
                    <span className="text-[16px] text-text-primary flex-1 group-hover:text-brand transition-colors">
                      {p.title}
                    </span>
                    <Pill className="self-start sm:self-auto">{p.tag}</Pill>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}
