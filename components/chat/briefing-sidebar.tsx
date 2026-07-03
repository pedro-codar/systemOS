"use client";

import { Clock, FileText, PanelRightClose } from "lucide-react";
import type { ReactNode } from "react";

type BriefingSidebarProps = {
  onClose: () => void;
};

type BriefingTask = {
  id: string;
  title: string;
  deadline: string;
  status: "overdue" | "in_progress";
};

type BriefingEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
};

type BriefingNotification = {
  id: string;
  message: string;
};

const overdueTasks: BriefingTask[] = [
  {
    id: "1",
    title: "Revisar fluxo de navegação do menu",
    deadline: "28/06/2026",
    status: "overdue",
  },
];

const upcomingTasks: BriefingTask[] = [
  {
    id: "2",
    title: "Ajustar contraste do rodapé",
    deadline: "02/07/2026",
    status: "in_progress",
  },
];

const upcomingEvents: BriefingEvent[] = [
  {
    id: "1",
    title: "Reunião de Alinhamento - Almara",
    date: "02/07",
    time: "14:00",
  },
];

const pendingNotifications: BriefingNotification[] = [
  {
    id: "1",
    message: "Novo colaborador convidado por Pedro Lucas",
  },
  {
    id: "2",
    message: "Tarefa 'Configurar Supabase' criada",
  },
];

const statusLabels = {
  overdue: "Atrasado",
  in_progress: "Em progresso",
} as const;

const statusStyles = {
  overdue: "bg-destructive/15 text-destructive",
  in_progress: "bg-muted text-muted-foreground",
} as const;

function BriefingSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="text-muted-foreground mb-3 text-[11px] font-medium tracking-wider uppercase">
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

function TaskCard({ task }: { task: BriefingTask }) {
  return (
    <div className="border-border bg-card rounded-lg border p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-foreground text-sm font-medium leading-snug">{task.title}</p>
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[task.status]}`}
        >
          {statusLabels[task.status]}
        </span>
      </div>
      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <Clock className="size-3.5 shrink-0" />
        <span>Prazo: {task.deadline}</span>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: BriefingEvent }) {
  return (
    <div className="border-border bg-card rounded-lg border p-3">
      <p className="text-foreground mb-2 text-sm font-medium leading-snug">{event.title}</p>
      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <span>{event.date}</span>
        <span>•</span>
        <Clock className="size-3.5 shrink-0" />
        <span>{event.time}</span>
      </div>
    </div>
  );
}

function NotificationCard({ notification }: { notification: BriefingNotification }) {
  return (
    <div className="border-border bg-card rounded-lg border px-3 py-2.5">
      <p className="text-muted-foreground text-sm leading-relaxed">
        <span className="text-muted-foreground mr-2">•</span>
        {notification.message}
      </p>
    </div>
  );
}

export function BriefingSidebar({ onClose }: BriefingSidebarProps) {
  return (
    <aside className="border-border bg-sidebar flex h-full w-80 shrink-0 flex-col border-l">
      <div className="border-border flex items-center justify-between border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <FileText className="text-foreground size-4" />
          <h2 className="text-foreground text-base font-semibold">Briefing</h2>
        </div>
        <button
          type="button"
          aria-label="Fechar briefing"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors"
        >
          <PanelRightClose className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-5">
        <BriefingSection title="Tarefas atrasadas">
          {overdueTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </BriefingSection>

        <BriefingSection title="Próximas entregas">
          {upcomingTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </BriefingSection>

        <BriefingSection title="Compromissos próximos">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </BriefingSection>

        <BriefingSection title="Notificações pendentes">
          {pendingNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </BriefingSection>
      </div>

      <div className="border-border flex items-center justify-between border-t px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="bg-primary size-2 rounded-full" />
          <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
            Sistema conectado
          </span>
        </div>
        <span className="text-muted-foreground text-xs">v1.2.0</span>
      </div>
    </aside>
  );
}
