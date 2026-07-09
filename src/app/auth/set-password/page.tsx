"use client";

import { SetPassword } from "@/lib/lib-auth";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    document.title = "Definir senha | Oratos";
  }, []);

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Link inválido ou expirado. Faça login para continuar.");
        router.replace("/auth/login");
        return;
      }

      setIsCheckingSession(false);
    }

    checkSession();
  }, [router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    const { error } = await SetPassword(password);

    if (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }

    toast.success("Senha definida com sucesso!");
    router.refresh();
    router.push("/chat");
  }

  const inputClassName =
    "bg-foreground/100 border-secondary-foreground/20 text-background placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 disabled:opacity-60 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2";

  if (isCheckingSession) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-primary-foreground border-secondary-foreground/15 rounded-2xl border p-8 shadow-sm">
            <div className="mb-8 flex justify-center">
              <img
                src="https://mclturmjholrfjqfivwi.supabase.co/storage/v1/object/public/system_images/oratus_light.png"
                alt="Oratus"
                width={1011}
                height={247}
                className="h-auto w-full max-w-[180px]"
              />
            </div>

            <div className="mb-8 text-center">
              <h1 className="text-background text-[40px] font-semibold tracking-tight">
                Definir senha
              </h1>
              <p className="text-background mx-auto mt-3 max-w-sm text-[15px] leading-relaxed">
                Crie sua senha para acessar a plataforma da sua empresa.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-background text-sm font-medium">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={isLoading}
                    className={`${inputClassName} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="text-muted-foreground hover:text-background absolute top-1/2 right-3 -translate-y-1/2 disabled:opacity-60"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-background text-sm font-medium"
                >
                  Confirmar senha
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={isLoading}
                  className={inputClassName}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/30 disabled:opacity-70 mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Acessar plataforma"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-muted-foreground hover:text-background text-sm transition-colors"
              >
                Já tem senha? Entrar
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
