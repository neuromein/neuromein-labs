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
      <section className="max-w-5xl mx-auto px-6 lg:px-8 pt-20 pb-12">
        <Reveal>
          <PageHeader
            eyebrow="Блог"
            title="Публикации"
            description="Аналитические заметки, разборы событий и мнения."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap gap-2">
            {TAGS.map((tag) => {
              const active = tag === activeTag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1.5 rounded-md text-[12px] tracking-[0.02em] transition-all duration-200 ${
                    active
                      ? "bg-status-info-bg text-status-info-fg"
                      : "bg-bg-card text-text-quaternary hover:text-text-secondary"
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
                    className="grid grid-cols-12 gap-4 items-center py-5 border-b border-border group"
                  >
                    <span className="col-span-12 sm:col-span-3 text-[13px] text-text-tertiary tabular-nums">
                      {p.dateLabel}
                    </span>
                    <span className="col-span-12 sm:col-span-7 text-[15px] text-[#dddde5] group-hover:underline underline-offset-4 decoration-text-tertiary">
                      {p.title}
                    </span>
                    <span className="col-span-12 sm:col-span-2 sm:text-right">
                      <Pill>{p.tag}</Pill>
                    </span>
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
