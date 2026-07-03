import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="bg-foreground text-background flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-center px-6 py-8">
        <span className="bg-primary/15 text-primary border-primary/30 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
          Systemos
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-background text-[40px] font-semibold tracking-tight">
              Criar Conta
            </h1>
            <p className="text-background mx-auto mt-3 max-w-sm text-[15px] leading-relaxed">
              Cadastre-se e comece a gerenciar sua empresa com o systemOS.
            </p>
          </div>

          <div className="bg-primary-foreground border-secondary-foreground/15 rounded-2xl border p-8 shadow-sm">
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
                  className="bg-foreground/100 border-secondary-foreground/20 text-background placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
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
                  className="bg-foreground/100 border-secondary-foreground/20 text-background placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
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
                  className="bg-foreground/100 border-secondary-foreground/20 text-background placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
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
                  placeholder="(00) 00000-0000"
                  className="bg-foreground/100 border-secondary-foreground/20 text-background placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-background text-sm font-medium"
                >
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="bg-foreground/100 border-secondary-foreground/20 text-background placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
                />
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
                  className="bg-foreground/100 border-secondary-foreground/20 text-background placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <button
                type="button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/30 w-full cursor-pointer rounded-xl px-5 py-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                Criar conta
              </button>

              <div className="flex items-center gap-3 py-1">
                <span className="bg-secondary-foreground/20 h-px flex-1" />
                <span className="text-muted-foreground text-xs">ou</span>
                <span className="bg-secondary-foreground/20 h-px flex-1" />
              </div>

              <Link
                href="/auth/login"
                className="bg-secondary-foreground/10 text-background hover:bg-secondary-foreground/15 border-secondary-foreground/20 focus-visible:ring-primary/30 w-full rounded-xl border px-5 py-3 text-center text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
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
