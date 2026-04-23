import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminLoginDialog({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAuth();
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // useEffect above handles redirect when isAdmin resolves
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка входа";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-bg border-border">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-medium text-text-primary tracking-[-0.01em]">
            Вход в личный кабинет
          </DialogTitle>
          <DialogDescription className="text-[13px] text-text-secondary">
            Управление прогнозами доступно только администратору.
          </DialogDescription>
        </DialogHeader>

        <button
          onClick={onGoogle}
          className="w-full h-11 rounded-lg bg-bg-card hover:bg-bg-card/80 border border-border text-[14px] font-medium text-text-primary transition-colors flex items-center justify-center gap-2"
        >
          <GoogleIcon />
          Продолжить с Google
        </button>

        <div className="flex items-center gap-3 my-1">
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
            placeholder="Пароль"
            className="h-11 px-3 rounded-lg bg-bg-card border border-border text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-secondary"
          />
          <button
            type="submit"
            disabled={submitting}
            className="h-11 rounded-lg bg-text-primary text-bg text-[14px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "..." : "Войти"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" />
    </svg>
  );
}