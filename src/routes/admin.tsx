import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, ListChecks, FileText, Mic, Settings as SettingsIcon, ExternalLink } from "lucide-react";
import logoUrl from "@/assets/logo.svg";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Личный кабинет – NEUROMEIN" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  enabled: boolean;
  hint?: string;
}

const NAV: NavItem[] = [
  { to: "/admin/predictions", label: "Прогнозы", icon: ListChecks, enabled: true },
  { to: "/admin/publications", label: "Публикации", icon: FileText, enabled: true },
  { to: "/admin/speaking", label: "Выступления", icon: Mic, enabled: true },
  { to: "/admin/settings", label: "Настройки", icon: SettingsIcon, enabled: false, hint: "скоро" },
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isAdmin, loading, signOut } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!session) navigate({ to: "/" });
  }, [loading, session, navigate]);

  async function handleSignOut() {
    await signOut();
    toast.success("Вы вышли из личного кабинета");
    navigate({ to: "/" });
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-text-secondary text-[14px]">
        Загрузка…
      </div>
    );
  }

  if (!session) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-4">
        <div className="max-w-[420px] w-full text-center">
          <h1 className="text-[24px] font-medium text-text-primary mb-3">Доступ закрыт</h1>
          <p className="text-[14px] text-text-secondary mb-6">
            Этот аккаунт не имеет прав администратора.
          </p>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-bg-card text-text-primary text-[14px] hover:bg-bg-card/80"
          >
            <LogOut size={14} /> Выйти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[240px] shrink-0 border-r border-border bg-bg-deep/40 flex-col">
        <div className="px-5 h-16 flex items-center gap-2 border-b border-border">
          <img src={logoUrl} alt="NEUROMEIN" className="h-4 w-auto opacity-90" />
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-tertiary">
            Админ
          </span>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            if (!item.enabled) {
              return (
                <div
                  key={item.to}
                  className="flex items-center gap-2.5 h-9 px-3 rounded-lg text-[13px] text-text-tertiary/60 cursor-not-allowed"
                  title={item.hint}
                >
                  <Icon size={15} className="shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.hint && (
                    <span className="text-[10px] uppercase tracking-wide opacity-60">
                      {item.hint}
                    </span>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 h-9 px-3 rounded-lg text-[13px] transition-colors ${
                  active
                    ? "bg-bg-card text-text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-card/60"
                }`}
              >
                <Icon size={15} className="shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-bg-deep/30 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" aria-hidden />
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wide text-text-tertiary leading-tight">
                Личный кабинет
              </div>
              <div className="text-[13px] text-text-primary truncate">
                {session.user.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-border bg-bg-card/60 text-text-secondary hover:text-text-primary hover:bg-bg-card text-[13px] transition-colors"
              title="Перейти на сайт"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">На сайт</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-border bg-bg-card/60 text-text-secondary hover:text-text-primary hover:bg-bg-card text-[13px] transition-colors"
              title="Выйти из личного кабинета"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="md:hidden flex gap-1 p-2 border-b border-border overflow-x-auto bg-bg-deep/30">
          {NAV.filter((n) => n.enabled).map((item) => {
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`inline-flex items-center gap-2 h-9 px-3 rounded-lg text-[13px] whitespace-nowrap ${
                  active
                    ? "bg-bg-card text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
