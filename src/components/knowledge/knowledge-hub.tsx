import { Brain } from "lucide-react";

const COMPANY_NAME = "Foco em Layout Inc.";

export function KnowledgeHub() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="bg-primary/20 absolute -inset-3 rounded-3xl blur-2xl"
      />
      <div
        aria-hidden
        className="border-primary/30 absolute -inset-px rounded-2xl border"
      />

      <div className="border-primary/25 bg-popover/80 relative flex min-w-56 flex-col items-center rounded-2xl border px-8 py-6 shadow-2xl shadow-primary/15 backdrop-blur-md">
        <span className="from-primary/40 via-foreground/25 to-primary/40 absolute inset-x-5 top-0 h-px bg-gradient-to-r" />

        <div className="bg-primary/15 text-primary ring-primary/30 mb-3 flex h-9 w-9 items-center justify-center rounded-full ring-1">
          <Brain className="size-4" strokeWidth={1.75} />
        </div>

        <span className="text-primary/80 text-[10px] font-semibold tracking-[0.25em] uppercase">
          Empresa
        </span>
        <h2 className="from-foreground via-foreground to-primary mt-1.5 bg-gradient-to-br bg-clip-text text-center text-lg font-bold tracking-tight text-transparent">
          {COMPANY_NAME}
        </h2>

        <div className="mt-4 flex items-center gap-1.5">
          <span className="bg-primary knowledge-pulse-dot h-1.5 w-1.5 rounded-full" />
          <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
            Cérebro ativo
          </span>
        </div>
      </div>
    </div>
  );
}
