import { Link } from "@tanstack/react-router";
import { NAV_LINKS, SITE } from "@/lib/site";
import logoUrl from "@/assets/logo.svg";

export function Footer() {
  return (
    <footer className="px-4 lg:px-6 mt-20">
      <div className="max-w-[1320px] mx-auto rounded-[24px] border-[0.5px] border-border bg-bg-card/40 p-8 lg:p-12 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          <div className="max-w-[400px]">
            <img src={logoUrl} alt="NEUROMEIN" className="h-5 w-auto opacity-95" />
            <div className="mt-5 text-[14px] text-text-primary font-medium">
              {SITE.author}
            </div>
            <p className="mt-2 text-[14px] text-text-secondary leading-relaxed">
              Независимый аналитический ресурс об искусственном интеллекте и рынке труда.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-10">
            <div>
              <div className="label-eyebrow mb-4">Навигация</div>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    to="/"
                    className="text-[14px] text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Главная
                  </Link>
                </li>
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

        <div className="mt-12 pt-6 border-t border-border flex items-center justify-between text-[12px] text-text-tertiary">
          <span>© 2026 {SITE.author}</span>
          <img src={logoUrl} alt="NEUROMEIN" className="h-3 w-auto opacity-40" />
        </div>
      </div>
    </footer>
  );
}
