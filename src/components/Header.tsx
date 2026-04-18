import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/site";
import logoUrl from "@/assets/logo.svg";

export function Header() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const items = [{ to: "/", label: "Главная", exact: true }, ...NAV_LINKS.map((l) => ({ ...l, exact: false }))];

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      {/* Desktop pill */}
      <div className="hidden md:flex items-center gap-3 pl-5 pr-3 py-2 rounded-full border-[0.5px] border-border bg-bg-card/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <Link to="/" aria-label="NEUROMEIN" className="flex items-center justify-center h-10 px-1">
          <img src={logoUrl} alt="NEUROMEIN" className="h-7 w-auto opacity-95" />
        </Link>
        <nav
          className="flex items-center ml-3 gap-1"
          onMouseLeave={() => setHovered(null)}
        >
          {items.map((l) => {
            const isHovered = hovered === l.to;
            const anyHovered = hovered !== null;
            return (
              <motion.div
                key={l.to}
                animate={{
                  marginLeft: anyHovered && !isHovered ? 8 : 2,
                  marginRight: anyHovered && !isHovered ? 8 : 2,
                  scale: isHovered ? 1.04 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                onMouseEnter={() => setHovered(l.to)}
              >
                <NavPill to={l.to} exact={l.exact}>
                  {l.label}
                </NavPill>
              </motion.div>
            );
          })}
        </nav>
        <button
          aria-label="Поиск"
          className="ml-1 flex items-center justify-center h-9 w-9 rounded-full bg-bg-deep text-text-secondary hover:text-text-primary transition-colors"
        >
          <SearchIcon />
        </button>
      </div>

      {/* Mobile pill */}
      <div className="md:hidden flex items-center justify-between w-full max-w-[420px] pl-4 pr-2 py-2 rounded-full border-[0.5px] border-border bg-bg-card/70 backdrop-blur-xl">
        <Link to="/" aria-label="NEUROMEIN" className="flex items-center h-10">
          <img src={logoUrl} alt="NEUROMEIN" className="h-6 w-auto" />
        </Link>
        <button
          aria-label="Меню"
          className="flex items-center justify-center h-9 w-9 rounded-full bg-bg-deep text-text-primary"
          onClick={() => setOpen((v) => !v)}
        >
          <BurgerIcon open={open} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-0 bg-bg/95 backdrop-blur-xl z-40 pt-28"
          >
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-7 px-8"
            >
              {items.map((l, i) => (
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
          "px-3.5 py-1.5 rounded-full text-[13px] text-text-primary bg-bg-deep",
      }}
    >
      {children}
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`block h-px w-4 bg-current transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
      <span className={`block h-px w-4 bg-current transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`} />
      <span className={`block h-px w-4 bg-current transition-transform duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
    </div>
  );
}
