import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { Reveal } from "@/components/Reveal";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Вход — NEUROMEIN" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session && isAdmin) {
      navigate({ to: "/predictions/admin" });
    }
  }, [loading, session, isAdmin, navigate]);

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/predictions/admin" },
        });
        if (error) throw error;
        toast.success("Аккаунт создан. Можете войти.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function onGoogle() {
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/predictions/admin",
      });
      if (result.error) throw result.error;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка входа через Google";
      toast.error(msg);
    }
  }

  return (
    <Layout>
      <div className="max-w-[440px] mx-auto pt-12 pb-24 px-4">
        <Reveal>
          <div className="text-center mb-10">
            <div className="text-[11px] uppercase tracking-[0.12em] text-text-tertiary mb-2">
              Личный кабинет
            </div>
            <h1 className="text-[28px] font-medium tracking-[-0.02em] text-text-primary">
              {mode === "signin" ? "Вход" : "Создать аккаунт"}
            </h1>
            <p className="mt-3 text-[14px] text-text-secondary">
              Управление прогнозами доступно только администратору.
            </p>
          </div>

          <button
            onClick={onGoogle}
            className="w-full h-11 rounded-lg bg-bg-card hover:bg-bg-card/80 border border-border text-[14px] font-medium text-text-primary transition-colors flex items-center justify-center gap-2"
          >
            <GoogleIcon />
            Продолжить с Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary">или</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={onEmailSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="h-11 px-3 rounded-lg bg-bg-card border border-border text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-secondary"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль (минимум 6 символов)"
              className="h-11 px-3 rounded-lg bg-bg-card border border-border text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-secondary"
            />
            <button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-lg bg-text-primary text-bg text-[14px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "..." : mode === "signin" ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
            >
              {mode === "signin"
                ? "Нет аккаунта? Зарегистрироваться"
                : "Уже есть аккаунт? Войти"}
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link to="/predictions" className="text-[13px] text-text-tertiary hover:text-text-secondary">
              ← К прогнозам
            </Link>
          </div>
        </Reveal>
      </div>
    </Layout>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}