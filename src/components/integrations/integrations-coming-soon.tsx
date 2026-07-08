"use client";

import {
  SiClickup,
  SiGooglecalendar,
  SiGoogledrive,
  SiGoogletagmanager,
  SiInstagram,
  SiTrello,
  SiWhatsapp,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import { Lock, Plug2, Sparkles, Zap } from "lucide-react";
import type { ComponentType } from "react";
import { useAppContext } from "@/context/app-context";

type SimpleIconProps = {
  color?: string;
  size?: number | string;
  className?: string;
  title?: string;
};

type IntegrationItem = {
  id: string;
  name: string;
  Icon: ComponentType<SimpleIconProps>;
  surfaceClass: string;
};

const INTEGRATIONS: IntegrationItem[] = [
  {
    id: "google-drive",
    name: "Google Drive",
    Icon: SiGoogledrive,
    surfaceClass: "from-foreground/12 to-muted/40 ring-border",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    Icon: SiGooglecalendar,
    surfaceClass: "from-foreground/12 to-muted/40 ring-border",
  },
  {
    id: "google-tag-manager",
    name: "Google Tag Manager",
    Icon: SiGoogletagmanager,
    surfaceClass: "from-foreground/12 to-muted/40 ring-border",
  },
  {
    id: "trello",
    name: "Trello",
    Icon: SiTrello,
    surfaceClass: "from-foreground/12 to-muted/40 ring-border",
  },
  {
    id: "clickup",
    name: "ClickUp",
    Icon: SiClickup,
    surfaceClass: "from-foreground/12 to-muted/40 ring-border",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    Icon: SiWhatsapp,
    surfaceClass: "from-foreground/12 to-muted/40 ring-border",
  },
  {
    id: "youtube",
    name: "YouTube",
    Icon: SiYoutube,
    surfaceClass: "from-foreground/12 to-muted/40 ring-border",
  },
  {
    id: "instagram",
    name: "Instagram",
    Icon: SiInstagram,
    surfaceClass: "from-foreground/12 to-muted/40 ring-border",
  },
];

export function IntegrationsComingSoon() {
  const { company } = useAppContext();
  const companyName = company?.name?.trim() || "Sua empresa";

  return (
    <div className="relative py-4">
      <div className="relative w-full">
        <div className="border-border bg-card/70 relative overflow-hidden rounded-3xl border p-8 shadow-2xl shadow-primary/10 backdrop-blur-md sm:p-10">
          <div
            aria-hidden
            className="from-primary/10 via-transparent to-accent/10 pointer-events-none absolute inset-0 bg-gradient-to-br"
          />
          <span className="from-primary via-accent to-primary integrations-shimmer-text absolute inset-x-0 top-0 h-px bg-gradient-to-r" />
          <span className="from-primary/20 via-accent/10 to-primary/20 absolute inset-x-12 bottom-0 h-px bg-gradient-to-r" />

          <div className="relative flex flex-col items-center text-center">
            <span className="bg-primary/20 text-primary ring-primary/30 mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase ring-1">
              <Sparkles className="size-3.5" />
              Em breve
            </span>

            <h2 className="mb-3 max-w-2xl text-2xl font-bold tracking-tight sm:text-4xl">
              <span className="from-foreground via-foreground to-primary bg-gradient-to-br bg-clip-text text-transparent">
                Conecte as ferramentas da sua empresa
              </span>
            </h2>

            <p className="text-muted-foreground mb-10 max-w-2xl text-sm leading-relaxed sm:text-base">
              Estamos construindo integrações para que o assistente de IA leia,
              sincronize e aja nos apps que sua equipe já usa no dia a dia.
            </p>

            <div className="flex w-full flex-col items-center">
              <div className="integrations-float relative">
                <div className="bg-primary/15 knowledge-ring-pulse absolute -inset-2 rounded-3xl" />
                <div className="border-primary/25 bg-popover/90 relative flex flex-col items-center rounded-2xl border px-8 py-5 shadow-xl shadow-primary/15 backdrop-blur-md">
                  <span className="from-primary/40 via-foreground/25 to-primary/40 absolute inset-x-5 top-0 h-px bg-gradient-to-r" />

                  <div className="bg-primary/15 text-primary ring-primary/30 mb-3 flex size-10 items-center justify-center rounded-full ring-1">
                    <Plug2 className="size-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="from-foreground via-foreground to-primary mt-1 max-w-[200px] truncate bg-gradient-to-br bg-clip-text text-base font-bold tracking-tight text-transparent">
                    {companyName}
                  </h3>
                </div>
              </div>

              <div
                aria-hidden
                className="from-primary/60 to-primary/20 h-8 w-px bg-gradient-to-b"
              />

              <div
                aria-hidden
                className="border-primary/35 mb-0 h-px w-full border-t"
              />

              <div className="grid w-full grid-cols-2 gap-3 pt-6 sm:grid-cols-4 sm:gap-4">
                {INTEGRATIONS.map((integration, index) => {
                  const Icon = integration.Icon;

                  return (
                    <div key={integration.id} className="relative flex flex-col items-center">
                      <div
                        aria-hidden
                        className="from-primary/50 to-primary/15 absolute -top-6 left-1/2 h-6 w-px -translate-x-1/2 bg-gradient-to-b"
                      />

                      <div
                        className="border-border bg-background/50 group hover:border-primary/40 relative flex w-full flex-col items-center gap-3 overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/15"
                        style={{ animationDelay: `${index * 80}ms` }}
                      >
                        <div
                          aria-hidden
                          className="from-primary/0 to-primary/10 absolute inset-0 bg-gradient-to-b opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />

                        <div
                          className={`bg-gradient-to-br ${integration.surfaceClass} text-foreground group-hover:text-muted-foreground relative flex size-14 items-center justify-center rounded-2xl shadow-inner ring-1 transition-all duration-300 group-hover:scale-110`}
                        >
                          <Icon color="currentColor" size={26} />
                        </div>

                        <p className="text-foreground relative text-center text-xs font-semibold leading-tight">
                          {integration.name}
                        </p>

                        <span className="bg-muted/80 text-muted-foreground ring-border relative inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-medium tracking-wide uppercase ring-1">
                          <Lock className="size-2.5" />
                          Em breve
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="bg-primary knowledge-pulse-dot size-1.5 rounded-full" />
          <p className="text-muted-foreground text-xs">
            Publicação em breve · novas integrações serão adicionadas nas próximas versões
          </p>
        </div>
      </div>
    </div>
  );
}
