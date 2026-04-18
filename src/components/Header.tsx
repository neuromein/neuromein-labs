import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/site";
import { SearchDialog } from "./SearchDialog";
import logoUrl from "@/assets/logo.svg";

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Track scroll to make header opaque
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cmd/Ctrl+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const items = [{ to: "/", label: "Главная", exact: true }, ...NAV_LINKS.map((l) => ({ ...l, exact: false }))];

  // Pill background style: changes when scrolled
  const pillBg = scrolled
    ? "rgba(8, 8, 13, 0.92)"
    : "rgba(8, 8, 13, 0.55)";
  const pillBlur = scrolled ? "blur(20px)" : "blur(14px)";

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      {/* Desktop pill — visible on lg and above (>= 1024px). Below uses mobile/burger. */}
      <div
        className="hidden lg:flex items-center gap-2 pl-5 pr-3 py-2.5 rounded-full border-[0.5px] border-border shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-[background,backdrop-filter] duration-300"
        style={{
          background: pillBg,
          backdropFilter: pillBlur,
          WebkitBackdropFilter: pillBlur,
        }}
      >
        <Link to="/" aria-label="NEUROMEIN" className="flex items-center justify-center h-11 px-[3px]">
          <img src={logoUrl} alt="NEUROMEIN" className="h-[13px] w-auto opacity-95" />
        </Link>
        <nav
          className="flex items-center ml-2 gap-0.5"
          onMouseLeave={() => setHovered(null)}
        >
          {items.map((l) => {
            const isHovered = hovered === l.to;
            const anyHovered = hovered !== null;
            return (
              <motion.div
                key={l.to}
                animate={{
                  marginLeft: anyHovered && !isHovered ? 6 : 1,
                  marginRight: anyHovered && !isHovered ? 6 : 1,
                  scale: isHovered ? 1.05 : 1,
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
          aria-label="Поиск (⌘K)"
          onClick={() => setSearchOpen(true)}
          className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-bg-deep text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
        >
          <SearchIcon />
        </button>
      </div>

      {/* Mobile / tablet pill — shown below lg (< 1024px) */}
      <div
        className="lg:hidden flex items-center justify-between w-full max-w-[420px] pl-4 pr-2 py-2 rounded-full border-[0.5px] border-border transition-[background,backdrop-filter] duration-300"
        style={{
          background: pillBg,
          backdropFilter: pillBlur,
          WebkitBackdropFilter: pillBlur,
        }}
      >
        <Link to="/" aria-label="NEUROMEIN" className="flex items-center h-10">
          <img src={logoUrl} alt="NEUROMEIN" className="h-[15px] w-auto" />
        </Link>
        <div className="flex items-center gap-1">
          <button
            aria-label="Поиск"
            onClick={() => setSearchOpen(true)}
            className="flex items-center justify-center h-9 w-9 rounded-full bg-bg-deep text-text-secondary"
          >
            <SearchIcon />
          </button>
          <button
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            className="flex items-center justify-center h-9 w-9 rounded-full bg-bg-deep text-text-primary"
            onClick={() => setOpen((v) => !v)}
          >
            <BurgerIcon open={open} />
          </button>
        </div>
      </div>

      {/* Mobile menu: dim overlay + slide-in panel from the right */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.5)" }}
            />
            {/* Slide-in panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[380px] flex flex-col"
              style={{ background: "#08080D" }}
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <img src={logoUrl} alt="NEUROMEIN" className="h-[16px] w-auto opacity-90" />
                <button
                  aria-label="Закрыть меню"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-bg-card/60 text-text-primary"
                >
                  <CloseIcon />
                </button>
              </div>
              <nav className="flex flex-col gap-6 px-8 pt-12">
                {items.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={l.to}
                      activeOptions={{ exact: l.exact }}
                      className="text-[18px] font-medium text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
                      activeProps={{
                        className:
                          "text-[18px] font-medium text-brand whitespace-nowrap",
                      }}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
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
      className="px-3.5 py-2.5 rounded-full text-[14px] text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
      activeProps={{
        className:
          "px-3.5 py-2.5 rounded-full text-[14px] text-text-primary bg-bg-deep whitespace-nowrap",
      }}
    >
      {children}
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  // 3 horizontal lines — color #888898 visually via currentColor on text-text-primary
  return (
    <div className="flex flex-col gap-[5px]" style={{ color: open ? "#f0f0f5" : "#888898" }}>
      <span
        className={`block h-[1.5px] w-4 bg-current rounded-full transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`}
      />
      <span
        className={`block h-[1.5px] w-4 bg-current rounded-full transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`}
      />
      <span
        className={`block h-[1.5px] w-4 bg-current rounded-full transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
      />
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 3L13 13M13 3L3 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
