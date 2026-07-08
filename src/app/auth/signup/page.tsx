'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Signup } from "@/lib/lib-auth";
import { toast } from "sonner";

function formatWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleWhatsappChange(value: string) {
    setWhatsapp(formatWhatsapp(value));
  }

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();

    if (!name || !company || !email || !password || !confirmPassword) {
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

    const { error: SignupError } = await Signup(name, company, password, email, whatsapp);

    if (SignupError) {
      toast.error("Erro ao criar conta.");
      setIsLoading(false);
      return;
    }

    toast.success("Conta criada com sucesso!");
    router.refresh();
    router.push("/chat");
  }

  const inputClassName =
    "bg-foreground/100 border-secondary-foreground/20 text-background placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 disabled:opacity-60 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2";

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
              <h1 className="text-background text-[25px] font-semibold tracking-tight">
                Criar Conta
              </h1>
              <p className="text-background mx-auto mt-3 max-w-sm text-[15px] leading-relaxed">
                Cadastre-se e comece a gerenciar sua empresa com ORATUS.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-background text-sm font-medium"
                >
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="company"
                  className="text-background text-sm font-medium"
                >
                  Nome da empresa
                </label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  autoComplete="organization"
                  placeholder="Nome da sua empresa"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  disabled={isLoading}
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-background text-sm font-medium"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="whatsapp"
                  className="text-background text-sm font-medium"
                >
                  WhatsApp
                </label>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Esse contato será usado apenas para entrar em contato com você em caso de
                  suporte.
                </p>
                <input
                  id="whatsapp"
                  type="tel"
                  name="whatsapp"
                  autoComplete="tel"
                  placeholder="(00) 0 0000-0000"
                  value={whatsapp}
                  onChange={(e) => handleWhatsappChange(e.target.value)}
                  disabled={isLoading}
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-background text-sm font-medium"
                >
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
                    onChange={(e) => setPassword(e.target.value)}
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSignup}
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/30 disabled:opacity-70 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar conta"
                )}
              </button>

              <div className="flex items-center gap-3 py-1">
                <span className="bg-secondary-foreground/20 h-px flex-1" />
                <span className="text-muted-foreground text-xs">ou</span>
                <span className="bg-secondary-foreground/20 h-px flex-1" />
              </div>

              <Link
                href="/auth/login"
                aria-disabled={isLoading}
                tabIndex={isLoading ? -1 : undefined}
                className="bg-secondary-foreground/10 text-background hover:bg-secondary-foreground/15 border-secondary-foreground/20 focus-visible:ring-primary/30 aria-disabled:pointer-events-none aria-disabled:opacity-60 w-full rounded-xl border px-5 py-3 text-center text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                Voltar para login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
