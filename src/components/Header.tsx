import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="text-[15px] font-medium text-text-primary tracking-tight">
          {SITE.author}
        </Link>

        {/* Desktop nav: pill */}
        <nav
          className={`hidden md:flex items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-300 ${
            scrolled
              ? "border-[0.5px] border-border-strong bg-bg-card/70 backdrop-blur-xl"
              : "border-[0.5px] border-border bg-bg-card/40 backdrop-blur-xl"
          }`}
        >
          <NavPill to="/" exact>Главная</NavPill>
          {NAV_LINKS.map((l) => (
            <NavPill key={l.to} to={l.to}>
              {l.label}
            </NavPill>
          ))}
        </nav>

        {/* CTA pill (desktop) */}
        <a
          href={SITE.telegram}
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-2 pl-5 pr-1.5 py-1.5 rounded-full border-[0.5px] border-border-strong bg-bg-card/40 backdrop-blur-xl text-[14px] text-text-primary hover:bg-bg-card/70 transition-colors group"
        >
          <span>Telegram</span>
          <span className="flex items-center justify-center h-7 w-7 rounded-full bg-brand text-[#08080D] group-hover:bg-brand-hover transition-colors">
            <ArrowUpRight />
          </span>
        </a>

        {/* Mobile burger */}
        <button
          aria-label="Меню"
          className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-px w-5 bg-text-primary transition-transform duration-300 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-text-primary transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-px w-5 bg-text-primary transition-transform duration-300 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-0 bg-bg/95 backdrop-blur-xl z-40 pt-24"
          >
            <motion.nav
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-7 p-8"
            >
              {[{ to: "/", label: "Главная" }, ...NAV_LINKS].map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                >
                  <Link
                    to={l.to}
                    className="text-[28px] font-medium text-text-primary tracking-tight"
                    activeProps={{ className: "text-brand" }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href={SITE.telegram}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-4 inline-flex items-center gap-3 self-start pl-5 pr-1.5 py-1.5 rounded-full border-[0.5px] border-border-strong bg-bg-card text-[16px] text-text-primary"
              >
                Telegram
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-brand text-[#08080D]">
                  <ArrowUpRight />
                </span>
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavPill({
  to,
  children,
  exact,
}: {
  to: string;
  children: React.ReactNode;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: exact ?? false }}
      className="px-3.5 py-1.5 rounded-full text-[13px] text-text-secondary hover:text-text-primary transition-colors"
      activeProps={{
        className:
          "px-3.5 py-1.5 rounded-full text-[13px] text-text-primary bg-bg-deep/60",
      }}
    >
      {children}
    </Link>
  );
}

function ArrowUpRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 12L12 4M12 4H5.5M12 4V10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
