"use client";

import { Clock, FileText, PanelRightClose } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Task } from "@/components/tasks/types";
import { GetTasks } from "@/lib/lib-task";
import { createClient } from "@/lib/supabase/client";
import { formatDeadline, isDeadlineOverdue } from "@/components/tasks/utils";

type BriefingSidebarProps = {
  onClose: () => void;
};

type BriefingTaskStatus = "pending" | "overdue" | "in_progress";

type BriefingTask = {
  id: string;
  title: string;
  deadline: string;
  status: BriefingTaskStatus;
};

const statusLabels = {
  pending: "Pendente",
  overdue: "Atrasado",
  in_progress: "Em progresso",
} as const;

const statusStyles = {
  pending: "bg-muted text-muted-foreground",
  overdue: "bg-destructive/15 text-destructive",
  in_progress: "bg-primary/15 text-primary",
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
        <span>Prazo: {formatDeadline(task.deadline)}</span>
      </div>
    </div>
  );
}

export function BriefingSidebar({ onClose }: BriefingSidebarProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (isMounted) {
          setTasks([]);
          setLoading(false);
        }
        return;
      }

      const { data: profile } = await supabase
        .from("profile")
        .select("company_id")
        .eq("id", user.id)
        .maybeSingle();

      let companyId = profile?.company_id;

      if (!companyId) {
        const { data: company } = await supabase
          .from("company")
          .select("id")
          .eq("owner_id", user.id)
          .maybeSingle();

        companyId = company?.id;
      }

      if (!companyId) {
        if (isMounted) {
          setTasks([]);
          setLoading(false);
        }
        return;
      }

      const { data } = await GetTasks(supabase, companyId);

      if (isMounted) {
        setTasks(data ?? []);
        setLoading(false);
      }
    }

    void loadTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const { overdueTasks, upcomingTasks } = useMemo(() => {
    const withDeadline = tasks.filter((task) => task.deadline);

    const overdue = withDeadline
      .filter((task) => task.status !== "completed" && isDeadlineOverdue(task.deadline))
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .slice(0, 5)
      .map((task) => ({ ...task, status: "overdue" as const }));

    const upcoming = withDeadline
      .filter((task) => task.status !== "completed" && !isDeadlineOverdue(task.deadline))
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .slice(0, 5)
      .map(
        (task): BriefingTask => ({
          ...task,
          status: task.status === "pending" ? "pending" : "in_progress",
        }),
      );

    return { overdueTasks: overdue, upcomingTasks: upcoming };
  }, [tasks]);

  const showEmpty = !loading && overdueTasks.length === 0 && upcomingTasks.length === 0;

  return (
    <>
      <button
        type="button"
        aria-label="Fechar briefing"
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={onClose}
      />

      <aside className="border-border bg-sidebar fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-sm flex-col border-l shadow-xl md:static md:w-80 md:max-w-none md:shadow-none">
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
          {loading ? (
            <p className="text-muted-foreground text-sm">Carregando tarefas...</p>
          ) : showEmpty ? (
            <p className="text-muted-foreground text-sm">
              Nenhuma tarefa com prazo para exibir.
            </p>
          ) : (
            <>
              <BriefingSection title="Tarefas atrasadas">
                {overdueTasks.length > 0 ? (
                  overdueTasks.map((task) => <TaskCard key={task.id} task={task} />)
                ) : (
                  <p className="text-muted-foreground text-sm">Sem tarefas atrasadas.</p>
                )}
              </BriefingSection>

              <BriefingSection title="Próximas entregas">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => <TaskCard key={task.id} task={task} />)
                ) : (
                  <p className="text-muted-foreground text-sm">Sem próximas entregas.</p>
                )}
              </BriefingSection>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
