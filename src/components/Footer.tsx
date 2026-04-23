import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { NAV_LINKS, SITE } from "@/lib/site";
import logoUrl from "@/assets/logo.svg";
import { useState } from "react";
import { AdminLoginDialog } from "@/components/AdminLoginDialog";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  function onAdminLogoClick() {
    if (!loading && session && isAdmin) {
      if (location.pathname.startsWith("/admin")) {
        toast.success("Вы уже в личном кабинете");
        return;
      }

      navigate({ to: "/admin/predictions" });
      return;
    }

    setLoginOpen(true);
  }

  return (
    <footer className="px-4 lg:px-6 mt-20">
      <div className="max-w-[1320px] mx-auto rounded-[24px] border-[0.5px] border-border bg-bg-card/40 p-8 lg:p-12 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-x-[60px] gap-y-10">
          {/* Column 1: brand + Telegram CTA */}
          <div className="max-w-[420px]">
            <img src={logoUrl} alt="NEUROMEIN" className="h-5 w-auto opacity-95" />
            <div className="mt-5 text-[14px] text-text-primary font-medium">
              {SITE.author}
            </div>
            <p className="mt-2 text-[14px] text-text-secondary leading-relaxed">
              AI-стратег и аналитик. Аналитический ресурс об искусственном интеллекте и рынке труда.
            </p>

            {/* Telegram CTA — primary subscribe action */}
            <a
              href={SITE.telegram}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 h-11 pl-4 pr-5 rounded-full border-[0.5px] border-border-strong bg-bg-deep/60 text-[14px] text-text-primary hover:border-brand/50 hover:bg-bg-card transition-all duration-200 group"
            >
              <span
                className="flex items-center justify-center h-7 w-7 rounded-full"
                style={{ background: "rgba(74, 158, 245, 0.15)", color: "#4A9EF5" }}
                aria-hidden
              >
                <TelegramIcon />
              </span>
              <span>
                Telegram-канал:{" "}
                <span className="text-brand group-hover:text-brand-hover transition-colors">
                  {SITE.telegramHandle}
                </span>
              </span>
            </a>
          </div>

          {/* Column 2: navigation */}
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

          {/* Column 3: contacts */}
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
                  className="text-text-secondary hover:text-text-primary transition-colors break-all"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex items-center justify-between text-[12px] text-text-tertiary">
          <span>© 2026 {SITE.author}</span>
          <button
            type="button"
            onClick={onAdminLogoClick}
            aria-label="Вход в личный кабинет"
            title="Вход в личный кабинет"
            className="opacity-40 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img src={logoUrl} alt="NEUROMEIN" className="h-3 w-auto" />
          </button>
        </div>
      </div>
      <AdminLoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </footer>
  );
}

function TelegramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 4L3 11l6 2 2 6 4-4 5 4 1-15z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
