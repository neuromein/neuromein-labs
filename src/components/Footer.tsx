import { Link } from "@tanstack/react-router";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-bg-deep border-t border-border mt-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="text-[13px] tracking-[0.08em] text-text-primary font-medium">
              {SITE.name}
            </div>
            <p className="mt-3 text-[14px] text-text-secondary leading-relaxed max-w-[260px]">
              Независимый аналитический ресурс об искусственном интеллекте и рынке труда.
            </p>
          </div>

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
                  Telegram · {SITE.telegramHandle}
                </a>
              </li>
              <li>
                <a
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  LinkedIn · Andrew Meinhardt
                </a>
              </li>
              <li>
                <span className="text-text-secondary">
                  Instagram · {SITE.instagram}
                </span>
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

        <div className="mt-16 pt-8 border-t border-border flex items-center justify-between text-[12px] text-text-tertiary">
          <span>© 2026 {SITE.name}. {SITE.author}.</span>
          <span className="tracking-[0.08em]">NEUROMEIN.RU</span>
        </div>
      </div>
    </footer>
  );
}
