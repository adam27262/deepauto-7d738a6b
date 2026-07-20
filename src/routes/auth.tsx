import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Login — Deep Auto Service" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. If email confirmation is on, check your inbox.");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-[var(--shadow-luxury)] p-8">
        <Link to="/" className="text-xs text-muted-foreground hover:text-primary">← Back to site</Link>
        <h1 className="font-display text-3xl font-bold mt-3">Admin {mode === "signin" ? "Sign In" : "Sign Up"}</h1>
        <p className="text-sm text-muted-foreground mt-1">Access the Deep Auto dashboard.</p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-2"><Label>Email</Label><Input name="email" type="email" required /></div>
          <div className="grid gap-2"><Label>Password</Label><Input name="password" type="password" required minLength={6} /></div>
          <Button type="submit" disabled={loading} className="rounded-full h-11 mt-2">
            {loading ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 text-sm text-muted-foreground hover:text-primary w-full"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
        <p className="mt-6 text-xs text-muted-foreground">
          First user must be granted admin role in the database.
        </p>
      </div>
    </div>
  );
}
