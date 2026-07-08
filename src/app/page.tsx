import Link from "next/link"
import { Bot, BookOpenText, Check, CheckSquare, Users } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-primary-foreground text-background">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between rounded-full border border-primary/20 bg-primary-foreground/90 px-4 py-3 backdrop-blur sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://mclturmjholrfjqfivwi.supabase.co/storage/v1/object/public/system_images/oratus_light.png"
              alt="Oratos"
              width={1011}
              height={247}
              className="h-auto w-full max-w-[140px] max-sm:max-w-[110px]"
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-background transition hover:bg-primary/10"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-accent"
            >
              Cadastrar
            </Link>
          </div>
        </header>

        <div className="relative flex flex-1 items-center py-12 sm:py-16 lg:py-20">
          <div className="absolute inset-x-0 top-12 -z-10 h-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-0 top-1/3 -z-10 h-48 w-48 rounded-full bg-info/10 blur-3xl" />

          <div className="grid w-full gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="flex max-w-2xl flex-col gap-6">

              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-background sm:text-5xl lg:text-6xl">
                  Sua empresa, centralizada e potencializada por IA.
                </h1>

                <h2 className="max-w-2xl text-base leading-7 text-background/70 sm:text-lg">
                  Organize tarefas, colaboradores, conhecimento e processos em uma plataforma com IA que entende o contexto do seu negócio e ajuda sua equipe a trabalhar com mais eficiência.
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/auth/sign-up"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-accent"
                >
                  Come&ccedil;ar agora
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-primary/15 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary-foreground p-3 shadow-2xl shadow-primary/20">
                <div className="mb-3 flex items-center gap-2 px-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
                </div>

                <div className="overflow-hidden rounded-[1.35rem] border border-border bg-background">
                  <iframe
                    className="aspect-video w-full"
                    src="https://www.youtube.com/embed/dzhQV4utUXE"
                    title="Apresentacao do Oratus"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
        <div className="mb-10 space-y-3 sm:mb-12">
          
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Recursos pensados para conectar toda a sua empresa.
          </h2>
          <p className="max-w-3xl text-base text-background/70 sm:text-lg">
            Cada módulo reúne conhecimento, processos, colaboradores e IA para tornar o trabalho mais organizado, colaborativo e eficiente.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-primary/20 bg-primary-foreground p-6 shadow-lg shadow-primary/10">
            <div className="mb-6 flex items-center gap-2 text-primary">
              <BookOpenText className="h-5 w-5" />
              <span className="text-sm font-semibold">Base de conhecimento</span>
            </div>

            <div className="relative mb-5 h-52 overflow-hidden rounded-2xl border border-primary/15 bg-background/[0.03]">
              <div className="knowledge-ring-pulse absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/25" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                Sua empresa
              </div>

              <div className="knowledge-pulse-dot absolute left-8 top-7 rounded-lg border border-info/25 bg-info/10 px-3 py-1 text-[18px] font-medium text-info">
                Processos
              </div>
              <div className="knowledge-pulse-dot absolute right-8 top-10 rounded-lg border border-success/25 bg-success/10 px-3 py-1 text-[18px] font-medium text-success">
                Cultura
              </div>
              <div className="knowledge-pulse-dot absolute bottom-8 left-10 rounded-lg border border-warning/25 bg-warning/10 px-3 py-1 text-[18px] font-medium text-warning">
                Metas
              </div>
              <div className="knowledge-pulse-dot absolute bottom-10 right-10 rounded-lg border border-primary/25 bg-primary/10 px-3 py-1 text-[18px] font-medium text-primary">
                Politicas
              </div>
            </div>

            <p className="text-sm leading-6 text-background/70">
              O cerebro da operacao: centralize regras, contexto e conhecimento
              estrategico para o assistente responder com consistencia.
            </p>
          </article>

          <article className="rounded-3xl border border-primary/20 bg-primary-foreground p-6 shadow-lg shadow-primary/10">
            <div className="mb-6 flex items-center gap-2 text-primary">
              <CheckSquare className="h-5 w-5" />
              <span className="text-sm font-semibold">Tarefas</span>
            </div>

            <div className="mb-5 grid h-52 grid-cols-3 gap-3 rounded-2xl border border-primary/15 bg-background/[0.03] p-3">
              <div className="rounded-xl border border-info/20 bg-info/10 p-2">
                <p className="mb-2 text-[11px] font-semibold text-info">A fazer</p>
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-info/40 animate-pulse" />
                  <div className="h-2 w-4/5 rounded-full bg-info/25 animate-pulse" />
                  <div className="h-2 w-3/5 rounded-full bg-info/30 animate-pulse" />
                </div>
              </div>
              <div className="rounded-xl border border-warning/20 bg-warning/10 p-2">
                <p className="mb-2 text-[11px] font-semibold text-warning">Em progresso</p>
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-warning/40 animate-pulse" />
                  <div className="h-2 w-3/4 rounded-full bg-warning/30 animate-pulse" />
                  <div className="h-2 w-2/3 rounded-full bg-warning/20 animate-pulse" />
                </div>
              </div>
              <div className="rounded-xl border border-success/20 bg-success/10 p-2">
                <p className="mb-2 text-[11px] font-semibold text-success">Concluido</p>
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-success/40 animate-pulse" />
                  <div className="h-2 w-2/3 rounded-full bg-success/30 animate-pulse" />
                  <div className="h-2 w-1/2 rounded-full bg-success/20 animate-pulse" />
                </div>
              </div>
            </div>

            <p className="text-sm leading-6 text-background/70">
              Visualize prioridades por status, distribua responsabilidades e
              acompanhe entregas da equipe em tempo real.
            </p>
          </article>

          <article className="rounded-3xl border border-primary/20 bg-primary-foreground p-6 shadow-lg shadow-primary/10">
            <div className="mb-6 flex items-center gap-2 text-primary">
              <Users className="h-5 w-5" />
              <span className="text-sm font-semibold">Colaboradores</span>
            </div>

            <div className="relative mb-5 h-52 overflow-hidden rounded-2xl border border-primary/15 bg-background/[0.03]">
              <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-xs font-semibold text-primary">
                Time
              </div>

              <div className="integrations-float absolute left-10 top-8 flex h-12 w-12 items-center justify-center rounded-full border border-info/25 bg-info/10 text-xs font-medium text-info">
                CEO
              </div>
              <div className="integrations-float absolute right-10 top-10 flex h-12 w-12 items-center justify-center rounded-full border border-success/25 bg-success/10 text-xs font-medium text-success">
                Ops
              </div>
              <div className="integrations-float absolute bottom-8 left-14 flex h-12 w-12 items-center justify-center rounded-full border border-warning/25 bg-warning/10 text-xs font-medium text-warning">
                Mkt
              </div>
              <div className="integrations-float absolute bottom-10 right-14 flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-xs font-medium text-primary">
                Fin
              </div>
            </div>

            <p className="text-sm leading-6 text-background/70">
              Convide sua equipe, defina papéis e mantenha todo mundo alinhado ao contexto da empresa — com segurança.
            </p>
          </article>

          <article className="rounded-3xl border border-primary/20 bg-primary-foreground p-6 shadow-lg shadow-primary/10">
            <div className="mb-6 flex items-center gap-2 text-primary">
              <Bot className="h-5 w-5" />
              <span className="text-sm font-semibold">Chat inteligente</span>
            </div>

            <div className="mb-5 flex h-52 flex-col gap-3 rounded-2xl border border-primary/15 bg-background/[0.03] p-4">
              
              <div className="ml-auto w-5/6 rounded-2xl rounded-br-sm border border-primary/25 bg-primary px-3 py-2 text-xs text-primary-foreground">
                Como funciona nosso processo de reembolso?
              </div>
              <div className="w-4/5 rounded-2xl rounded-bl-sm border border-border bg-primary/10 px-3 py-2 text-xs text-background/75">
                Reembolsos até R$200 você aprova direto. Acima disso, precisa passar pela Marina antes de liberar.
              </div>

              <div className="w-fit rounded-full border border-border bg-primary-foreground px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
              </div>
            </div>

            <p className="text-sm leading-6 text-background/70">
              Converse com o assistente com contexto real da operacao e receba
              respostas acionaveis para tomada de decisao.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-20 sm:px-8 sm:pb-24 lg:px-10 lg:pb-28">
        <div className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-primary-foreground p-6 text-center shadow-xl shadow-primary/10 sm:p-10">

          <p className="font-semibold text-primary sm:text-lg">
            Plano único
          </p>
          
          <p className="mt-2 text-5xl font-semibold tracking-tight text-background sm:text-6xl">
            R$97/m&ecirc;s
          </p>

          <p className="mt-4 text-base text-background/70 sm:text-lg">
            Uma única assinatura para você e toda sua equipe.
          </p>

          <div className="mx-auto mt-7 grid max-w-md gap-3 text-left">
            <div className="flex items-center gap-2 text-sm text-background/80">
              <Check className="h-4 w-4 text-success" />
              <span>Chat com IA</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-background/80">
              <Check className="h-4 w-4 text-success" />
              <span>Base de conhecimento</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-background/80">
              <Check className="h-4 w-4 text-success" />
              <span>Gestão de tarefas</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-background/80">
              <Check className="h-4 w-4 text-success" />
              <span>Colaboradores ilimitados</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/auth/sign-up"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-accent"
            >
              Testar gr&aacute;tis por 7 dias
            </Link>
            <p className="text-sm text-background/60">Sem cart&atilde;o de cr&eacute;dito</p>
          </div>
        </div>
      </section>
    </main>
  )
}