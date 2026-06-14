import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "sonner";

const CACHE_RESET_SCRIPT = `
(function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      registrations.forEach(function (registration) { registration.unregister(); });
    }).catch(function () {});
  }
  if ("caches" in window) {
    caches.keys().then(function (keys) {
      keys.forEach(function (key) { caches.delete(key); });
    }).catch(function () {});
  }
})();`;

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 pt-16 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="label-eyebrow">Страница не найдена</div>
          <h1 className="mt-3 text-[42px] font-medium text-text-primary">404</h1>
          <p className="mt-3 text-[15px] text-text-secondary">
            Запрошенный материал не существует или был перенесён.
          </p>
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 h-10 rounded-md text-[14px] font-medium bg-text-primary text-bg hover:opacity-90 transition-opacity"
            >
              На главную
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Андрей Майнгардт" },
      { name: "theme-color", content: "#08080D" },
      { name: "google-site-verification", content: "c4oKRkYygsB6EauJGmP6RCxTrDcS46MqfZ4IT26rPC8" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "NEUROMEIN" },
      { property: "og:locale", content: "ru_RU" },
      { property: "og:image", content: "https://neuromein.ru/og-default.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "alternate icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap&subset=latin,cyrillic",
      },
    ],
    scripts: [
      {
        children: CACHE_RESET_SCRIPT,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": "https://neuromein.ru/#person",
          name: "Андрей Майнгардт",
          alternateName: ["Andrey Meinhardt", "Andrew Meinhardt", "Andrey Mayngardt"],
          jobTitle: "Эксперт по влиянию ИИ на бизнес-процессы и рынок труда",
          description:
            "Эксперт по влиянию ИИ на бизнес-процессы и рынок труда. Автор исследования «Тихая замена». Исследует, как ИИ-автоматизация меняет профессии, компании и рынок труда в горизонте 2026–2030.",
          disambiguatingDescription:
            "Российский эксперт по влиянию ИИ на рынок труда, основатель аналитического ресурса NEUROMEIN. Не следует путать с Andrew Mainhart (сооснователь финтех-компании Oradian).",
          nationality: "Russian",
          knowsLanguage: ["ru"],
          worksFor: {
            "@type": "Organization",
            name: "WMT AI",
          },
          founder: {
            "@type": "Organization",
            name: "NEUROMEIN",
            url: "https://neuromein.ru",
          },
          url: "https://neuromein.ru",
          mainEntityOfPage: "https://neuromein.ru/about",
          sameAs: [
            "https://t.me/neuromein",
            "https://linkedin.com/in/andrew-meinhardt-306821361",
            "https://github.com/neuromein/Neurosovet",
            "https://vc.ru/id931194",
            "https://www.litres.ru/book/andrey-mayngardt/tihaya-zamena-kak-krizisy-2026-2028-izmenyat-rynok-truda-73764754/",
          ],
          knowsAbout: [
            "Artificial Intelligence",
            "AI-driven Labor Market Transformation",
            "Silent Replacement (Тихая замена)",
            "AI Risk Assessment for Enterprise",
            "Generative AI Business Impact",
            "AI Workforce Displacement 2026-2028",
            "One-Way Door Effect in AI Automation",
            "Pyramid to Barbell Labor Market Model",
            "Corporate AI Transformation Strategy",
            "AI Automation of Business Processes",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster theme="dark" position="top-right" />
    </AuthProvider>
  );
}
