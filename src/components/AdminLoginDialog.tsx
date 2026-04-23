import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminLoginDialog({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Auto-redirect to admin if already logged in as admin
  useEffect(() => {
    if (open && !loading && session && isAdmin) {
      onOpenChange(false);
      navigate({ to: "/predictions/admin" });
    }
  }, [open, loading, session, isAdmin, navigate, onOpenChange]);

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
        toast.success("Аккаунт создан. Теперь войдите.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // useEffect above handles redirect when isAdmin resolves
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка входа";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-bg border-border">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-medium text-text-primary tracking-[-0.01em]">
            {mode === "signin" ? "Вход в личный кабинет" : "Создать аккаунт"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {mode === "signin" ? "Форма входа" : "Форма регистрации"}
          </DialogDescription>
        </DialogHeader>

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
            placeholder={mode === "signup" ? "Придумайте пароль (минимум 6 символов)" : "Пароль"}
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

        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
          >
            {mode === "signin"
              ? "Первый вход? Создать аккаунт"
              : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
