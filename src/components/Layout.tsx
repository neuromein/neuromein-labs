import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 pt-24 lg:pt-28 px-4 lg:px-6">{children}</main>
      <Footer />
    </div>
  );
}
