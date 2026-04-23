import { useMemo, useState } from "react";
import { AlertTriangle, ChevronDown, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { validatePredictions } from "@/data/predictions.validation";
import type { Prediction } from "@/data/predictions";

export function PredictionsValidationBanner({
  predictions,
  alwaysShow = false,
}: {
  predictions: Prediction[];
  alwaysShow?: boolean;
}) {
  const report = useMemo(() => validatePredictions(predictions), []);
  const [open, setOpen] = useState(false);

  const isDev = import.meta.env.DEV;
  if (!alwaysShow && !isDev) return null;

  const hasIssues = report.issues.length > 0;

  if (!hasIssues) {
    if (!isDev) return null;
    return (
      <div
        className="mt-6 rounded-[16px] border-[0.5px] border-border bg-bg-card/40 px-4 py-3 flex items-center gap-3 text-[12.5px] text-text-tertiary"
        role="status"
      >
        <CheckCircle2 size={14} className="text-text-secondary shrink-0" />
        <span>
          Валидация данных: проверено {report.totalChecked} прогнозов — структура корректна
        </span>
      </div>
    );
  }

  return (
    <div
      className="mt-6 rounded-[16px] overflow-hidden"
      style={{
        background: "rgba(40, 20, 12, 0.55)",
        backdropFilter: "blur(22px) saturate(160%)",
        WebkitBackdropFilter: "blur(22px) saturate(160%)",
        border: "1px solid rgba(245, 158, 11, 0.25)",
        boxShadow:
          "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      role="alert"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <AlertTriangle size={16} className="text-amber-400 shrink-0" />
          <span className="text-[14px] text-text-primary font-medium">
            Валидация данных: найдено {report.issues.length}{" "}
            {pluralIssue(report.issues.length)} в {report.invalidCount} прогноз
            {plural(report.invalidCount)}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-text-tertiary transition-transform duration-300 shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-amber-400/10">
              <ul className="mt-3 space-y-2 max-h-[320px] overflow-y-auto pr-2">
                {report.issues.map((iss, i) => (
                  <li
                    key={i}
                    className="rounded-[10px] border-[0.5px] border-amber-400/15 bg-bg/40 px-3 py-2 text-[12.5px] leading-[1.5]"
                  >
                    <div className="text-text-tertiary text-[11px] uppercase tracking-[0.06em]">
                      {iss.predictionId} · {iss.path}
                    </div>
                    <div className="text-text-secondary mt-1">
                      <span className="text-text-primary">{iss.predictionTitle}</span>
                      {" — "}
                      <span className="text-amber-300">{iss.message}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-text-tertiary/80">
                Этот баннер виден только в dev-режиме. Исправьте данные в{" "}
                <code className="text-text-secondary">src/data/predictions.ts</code>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function plural(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "е";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "ах";
  return "ах";
}

function pluralIssue(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "проблема";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "проблемы";
  return "проблем";
}