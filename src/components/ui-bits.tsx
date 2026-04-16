import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

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
    "inline-flex items-center justify-center px-4 h-10 rounded-md text-[14px] font-medium transition-all duration-200";
  const styles =
    variant === "primary"
      ? "bg-text-primary text-bg hover:opacity-90"
      : "bg-transparent border border-border-strong text-text-secondary hover:text-text-primary hover:border-text-tertiary";
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  variant = "primary",
  className = "",
  external,
  href,
  to,
  params,
  ...rest
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  external?: boolean;
  href?: string;
  to?: string;
  params?: Record<string, string>;
}) {
  const base =
    "inline-flex items-center justify-center px-4 h-10 rounded-md text-[14px] font-medium transition-all duration-200";
  const styles =
    variant === "primary"
      ? "bg-text-primary text-bg hover:opacity-90"
      : "bg-transparent border border-border-strong text-text-secondary hover:text-text-primary hover:border-text-tertiary";

  if (external && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${base} ${styles} ${className}`}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      to={to ?? "/"}
      params={params as never}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </Link>
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
  const map: Record<string, string> = {
    default: "bg-bg-card text-text-secondary",
    info: "bg-status-info-bg text-status-info-fg",
    success: "bg-status-success-bg text-status-success-fg",
    warn: "bg-status-warn-bg text-status-warn-fg",
    fail: "bg-status-fail-bg text-status-fail-fg",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] tracking-[0.04em] ${map[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <div className="label-eyebrow mb-4">{eyebrow}</div>}
      <h1 className="text-[38px] sm:text-[42px] font-medium text-text-primary leading-[1.15] tracking-tight text-balance">
        {title}
      </h1>
      {description && (
        <p className="mt-5 text-[16px] text-text-secondary leading-[1.65] max-w-[640px]">
          {description}
        </p>
      )}
    </div>
  );
}
