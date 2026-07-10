import Link from "next/link"
import { Bot, BookOpenText, Check, CheckSquare, Users, type LucideIcon } from "lucide-react"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Início",
};

const FEATURES: {
  icon: LucideIcon
  title: string
  description: string
  videoSrc: string
}[] = [
  {
    icon: BookOpenText,
    title: "Base de conhecimento",
    description:
      "O cérebro da operação: centralize regras, contexto e conhecimento estratégico para o assistente responder com consistência.",
    videoSrc:
      "https://mclturmjholrfjqfivwi.supabase.co/storage/v1/object/public/system_images/animation_knowledge.mp4",
  },
  {
    icon: CheckSquare,
    title: "Tarefas",
    description:
      "Visualize prioridades por status, distribua responsabilidades e acompanhe entregas da equipe em tempo real.",
    videoSrc:
      "https://mclturmjholrfjqfivwi.supabase.co/storage/v1/object/public/system_images/animation_task.mp4",
  },
  {
    icon: Users,
    title: "Colaboradores",
    description:
      "Convide sua equipe, defina papéis e mantenha todo mundo alinhado ao contexto da empresa — com segurança.",
    videoSrc:
      "https://mclturmjholrfjqfivwi.supabase.co/storage/v1/object/public/system_images/animation_collaborator.mp4",
  },
  {
    icon: Bot,
    title: "Chat inteligente",
    description:
      "Converse com o assistente com contexto real da operação e receba respostas acionáveis para tomada de decisão.",
    videoSrc:
      "https://mclturmjholrfjqfivwi.supabase.co/storage/v1/object/public/system_images/animation_chat.mp4",
  },
]

function FeatureDemoVideo({ src }: { src: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-background shadow-inner">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background/30 via-transparent to-primary/5"
      />
      <video
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        preload="auto"
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none aspect-square w-full select-none object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}

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
                  href="/auth/signup"
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
                    src="https://www.youtube.com/embed/z1eSsCv-mzU"
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
          {FEATURES.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className="group overflow-hidden rounded-3xl border border-primary/20 bg-primary-foreground shadow-lg shadow-primary/10 transition hover:border-primary/30 hover:shadow-xl hover:shadow-primary/15"
              >
                <div className="p-5 sm:p-6">
                  <div className="mb-5 flex items-center gap-2.5 text-primary">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold">{feature.title}</span>
                  </div>

                  <div className="relative mb-5">
                    <div
                      aria-hidden="true"
                      className="absolute -inset-2 rounded-[1.35rem] bg-primary/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <FeatureDemoVideo src={feature.videoSrc} />
                  </div>

                  <p className="text-sm leading-6 text-background/70">{feature.description}</p>
                </div>
              </article>
            )
          })}
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
              href="/auth/signup"
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