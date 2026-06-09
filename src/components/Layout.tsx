import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-bg overflow-hidden">
      {/* Ambient blue glow – top */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] rounded-full opacity-60 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.55 0.16 255 / 0.25) 0%, oklch(0.50 0.14 245 / 0.10) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Ambient blue glow – bottom (как на madiyour.com) */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] rounded-full opacity-70 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.62 0.16 245 / 0.30) 0%, oklch(0.50 0.14 250 / 0.12) 40%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 flex flex-col flex-1">
        <Header />
        <main className="flex-1 pt-24 lg:pt-28 px-4 lg:px-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
