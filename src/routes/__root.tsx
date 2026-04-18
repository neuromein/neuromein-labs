import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "NEUROMEIN" },
      { property: "og:locale", content: "ru_RU" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
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
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
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
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
