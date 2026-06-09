import { motion } from "framer-motion";
import { Mail, Send, Linkedin } from "lucide-react";
import { SITE } from "@/lib/site";
import avatarUrl from "@/assets/avatar.jpg";

/**
 * Hero страницы /about — двухколоночный блок: фото слева, имя/роль/контакты справа.
 */
export function AboutHero() {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease }}
      className="relative overflow-hidden rounded-[28px] border-[0.5px] border-border"
      style={{
        background:
          "linear-gradient(180deg, #111118 0%, #0a0a10 60%, #08080D 100%)",
      }}
    >
      {/* Soft blue glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 75% 40%, oklch(0.55 0.16 250 / 0.18) 0%, transparent 55%)",
          filter: "blur(40px)",
        }}
      />
      {/* Subtle grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-8 lg:gap-12 p-7 sm:p-10 lg:p-14 items-center">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease }}
          className="relative w-full max-w-[420px] aspect-[4/5] rounded-[22px] overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow:
              "0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <img
            src={avatarUrl}
            alt="Андрей Майнгардт"
            className="h-full w-full object-cover"
            loading="eager"
          />
        </motion.div>

        {/* Text + contacts */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease }}
            style={{
              fontSize: "clamp(32px, 4.5vw, 48px)",
              fontWeight: 500,
              color: "#f0f0f5",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            Андрей Майнгардт
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease }}
            className="mt-4 max-w-[640px]"
            style={{
              fontSize: 16,
              color: "#9a9aaa",
              lineHeight: 1.55,
            }}
          >
            Эксперт по влиянию ИИ на бизнес-процессы и рынок труда · Автор исследования «Тихая замена» · Основатель NEUROMEIN
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <a
              href={`mailto:${SITE.email}`}
              className="group inline-flex items-center gap-2.5 h-10 pl-3 pr-4 rounded-full transition-colors duration-300"
              style={{ border: "1px solid #2a2a35", color: "#bdbdc8" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#4A9EF5";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2a35";
              }}
            >
              <Mail size={15} strokeWidth={1.5} />
              <span className="text-[13px]">{SITE.email}</span>
            </a>

            <SocialIconLink href={SITE.telegram} label="Telegram">
              <Send size={16} strokeWidth={1.5} />
            </SocialIconLink>

            <SocialIconLink href={SITE.linkedin} label="LinkedIn">
              <Linkedin size={16} strokeWidth={1.5} />
            </SocialIconLink>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function SocialIconLink({
  href,
  label,
  children,
  disabled,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const baseStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    border: "1px solid #2a2a35",
    color: disabled ? "#5a5a6a" : "#bdbdc8",
    background: "transparent",
  };

  const className =
    "inline-flex items-center justify-center rounded-full transition-colors duration-300";

  if (disabled || !href) {
    return (
      <span
        aria-label={label}
        className={className}
        style={{ ...baseStyle, cursor: "default" }}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={className}
      style={baseStyle}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#4A9EF5";
        (e.currentTarget as HTMLAnchorElement).style.color = "#f0f0f5";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2a35";
        (e.currentTarget as HTMLAnchorElement).style.color = "#bdbdc8";
      }}
    >
      {children}
    </a>
  );
}
