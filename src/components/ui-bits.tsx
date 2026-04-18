import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
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

/* Pill-style CTA button: white/dark capsule with circular accent */
export function PillCta({
  children,
  href,
  to,
  params,
  external,
  variant = "light",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  to?: string;
  params?: Record<string, string>;
  external?: boolean;
  variant?: "light" | "dark";
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-3 pl-6 pr-1.5 py-1.5 rounded-full text-[14px] font-medium transition-all duration-300 group";
  const styles =
    variant === "light"
      ? "bg-text-primary text-bg hover:bg-white"
      : "bg-bg-card border-[0.5px] border-border-strong text-text-primary hover:border-text-tertiary";
  const circle =
    variant === "light"
      ? "bg-brand text-[#08080D] group-hover:bg-brand-hover"
      : "bg-brand text-[#08080D] group-hover:bg-brand-hover";

  const content = (
    <>
      <span>{children}</span>
      <span
        className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors ${circle}`}
      >
        <ArrowIcon />
      </span>
    </>
  );

  if (external && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${base} ${styles} ${className}`}
      >
        {content}
      </a>
    );
  }
  return (
    <Link to={to ?? "/"} params={params as never} className={`${base} ${styles} ${className}`}>
      {content}
    </Link>
  );
}

/* Ghost pill button — used for secondary actions */
export function GhostPill({
  children,
  href,
  to,
  external,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  to?: string;
  external?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] text-text-secondary border-[0.5px] border-border-strong hover:text-text-primary hover:border-text-tertiary transition-all duration-300";
  if (external && href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={`${base} ${className}`}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to ?? "/"} className={`${base} ${className}`}>
      {children}
    </Link>
  );
}

/* Legacy plain Button (kept for places that don't need pill style) */
export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
} & ComponentProps<"button">) {
  const base =
    "inline-flex items-center justify-center px-5 h-10 rounded-full text-[14px] font-medium transition-all duration-200";
  const styles =
    variant === "primary"
      ? "bg-text-primary text-bg hover:opacity-90"
      : "bg-transparent border-[0.5px] border-border-strong text-text-secondary hover:text-text-primary hover:border-text-tertiary";
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function Pill({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: "default" | "info" | "success" | "warn" | "fail";
  className?: string;
}) {
  // Цветные пилюли для статусов прогнозов:
  // полупрозрачный фон + тонкая обводка цвета статуса + цветной текст.
  const map: Record<string, { bg: string; border: string; color: string }> = {
    default: {
      bg: "transparent",
      border: "var(--color-border)",
      color: "var(--color-text-secondary)",
    },
    info: {
      bg: "rgba(74, 158, 245, 0.10)",
      border: "rgba(74, 158, 245, 0.20)",
      color: "#4A9EF5",
    },
    success: {
      bg: "rgba(74, 232, 140, 0.10)",
      border: "rgba(74, 232, 140, 0.20)",
      color: "#4AE88C",
    },
    warn: {
      bg: "rgba(232, 200, 74, 0.10)",
      border: "rgba(232, 200, 74, 0.20)",
      color: "#E8C84A",
    },
    fail: {
      bg: "rgba(232, 74, 74, 0.10)",
      border: "rgba(232, 74, 74, 0.20)",
      color: "#E84A4A",
    },
  };
  const s = map[variant];
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium tracking-[0.02em] border ${className}`}
      style={{
        background: s.bg,
        borderColor: s.border,
        color: s.color,
      }}
    >
      {children}
    </span>
  );
}

/* Page header — huge typographic display in Daniel Santos style */
export function PageHeader({
  eyebrow,
  title,
  description,
  accent,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  accent?: string; // optional second word with gradient fade
}) {
  return (
    <div>
      {eyebrow && <div className="label-eyebrow mb-6">{eyebrow}</div>}
      <h1 className="display-hero text-text-primary">
        {title}
      </h1>
      {accent && (
        <h2 className="display-hero display-hero--fade mt-2">
          {accent}
        </h2>
      )}
      {description && (
        <div className="mt-10 pt-8 border-t border-border max-w-[640px]">
          <p className="text-[16px] text-text-secondary leading-[1.65]">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}

export function ArrowLink({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[14px] text-text-primary group-hover:text-brand transition-colors">
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowIcon />
      </span>
    </span>
  );
}
