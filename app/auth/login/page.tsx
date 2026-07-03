'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";


export default function LoginPage() {
    const router = useRouter()

    function handleLogin(){
        router.push('/chat')
    }

    return (
        <div className="bg-foreground text-background flex min-h-full flex-1 flex-col">
        <header className="flex items-center justify-center px-6 py-8">
            <span className="bg-primary/15 text-primary border-primary/30 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            Systemos
            </span>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 pb-12">
            <div className="w-full max-w-md">
            

            <div className="bg-primary-foreground border-secondary-foreground/15 rounded-2xl border p-8 shadow-sm">

            <div className="mb-8 text-center">
                <h1 className="text-background text-[40px] font-semibold tracking-tight">
                    Entrar
                </h1>
                <p className="text-background mx-auto mt-3 max-w-sm text-[15px] leading-relaxed">
                Dê vida a qualquer ideia com as ferramentas do systemOS.
                </p>
            </div>

                <div className="flex flex-col gap-5">
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
                    htmlFor="password"
                    className="text-background text-sm font-medium"
                    >
                    Senha
                    </label>
                    <input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="bg-foreground/100 border-secondary-foreground/20 text-background placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
                    />
                </div>
                </div>

                <div className="mt-7 flex flex-col gap-3">
                <button
                    type="button"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/30 w-full cursor-pointer rounded-xl px-5 py-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    onClick={handleLogin}
                >
                    Entrar
                </button>

                <div className="flex items-center gap-3 py-1">
                    <span className="bg-secondary-foreground/20 h-px flex-1" />
                    <span className="text-muted-foreground text-xs">ou</span>
                    <span className="bg-secondary-foreground/20 h-px flex-1" />
                </div>

                <Link
                    href="/auth/signup"
                    className="bg-secondary-foreground/10 text-background hover:bg-secondary-foreground/15 border-secondary-foreground/20 focus-visible:ring-primary/30 w-full rounded-xl border px-5 py-3 text-center text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                    Criar conta
                </Link>
                </div>
            </div>
            </div>
        </main>
        </div>
    );
}
