import { useMemo } from "react";

type Block =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string };

function parse(raw: string): Block[] {
  const blocks: Block[] = [];
  const parts = raw.split(/\n{2,}/);
  for (const part of parts) {
    const s = part.trim();
    if (!s) continue;
    if (s.startsWith("## ")) {
      blocks.push({ kind: "h2", text: s.slice(3).trim() });
    } else {
      blocks.push({ kind: "p", text: s });
    }
  }
  return blocks;
}

export function ResearchBody({ raw }: { raw: string }) {
  const blocks = useMemo(() => parse(raw), [raw]);
  return (
    <div className="prose-research max-w-[760px] mx-auto px-6 lg:px-8 py-10 lg:py-14">
      {blocks.map((b, i) =>
        b.kind === "h2" ? (
          <h2
            key={i}
            className="mt-10 first:mt-0 text-[22px] sm:text-[26px] font-medium text-text-primary leading-[1.25] tracking-[-0.015em]"
          >
            {b.text}
          </h2>
        ) : (
          <p
            key={i}
            className="mt-4 text-[16px] sm:text-[17px] text-text-secondary leading-[1.75]"
          >
            {b.text}
          </p>
        ),
      )}
    </div>
  );
}