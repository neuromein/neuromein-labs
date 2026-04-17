import { Link } from "@tanstack/react-router";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border mt-40">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-16">
          <div className="max-w-[360px]">
            <div className="text-[15px] text-text-primary font-medium tracking-tight">
              {SITE.author}
            </div>
            <p className="mt-3 text-[14px] text-text-secondary leading-relaxed">
              Независимый аналитический ресурс об искусственном интеллекте и рынке труда.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-10">
            <div>
              <div className="label-eyebrow mb-4">Навигация</div>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-[14px] text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="label-eyebrow mb-4">Контакты</div>
              <ul className="space-y-2.5 text-[14px]">
                <li>
                  <a
                    href={SITE.telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Telegram
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {SITE.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-border flex items-center justify-between text-[12px] text-text-tertiary">
          <span>© 2026 {SITE.name}</span>
          <span className="tracking-[0.08em]">NEUROMEIN.RU</span>
        </div>
      </div>
    </footer>
  );
}
