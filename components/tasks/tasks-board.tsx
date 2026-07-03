"use client";

import { ArrowRight, Circle, CircleCheck, CircleDashed, Plus } from "lucide-react";
import { useState } from "react";
import { CreateTaskModal } from "./create-task-modal";
import { TaskCard } from "./task-card";
import { TaskDetailModal } from "./task-detail-modal";
import type { NewTaskData, Task, TaskStatus } from "./types";
import { TASK_STATUS_LABELS, TASK_STATUS_ORDER } from "./types";

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Revisar proposta comercial Q3",
    description:
      "Analisar valores, condições de pagamento e escopo de entrega antes de enviar ao cliente.",
    deadline: "2026-07-05",
    status: "pending",
    createdAt: "2026-06-28",
  },
  {
    id: "2",
    title: "Atualizar base de conhecimento",
    description: "Incluir novos processos de onboarding e políticas internas revisadas.",
    deadline: "2026-07-08",
    status: "pending",
    createdAt: "2026-06-30",
  },
  {
    id: "3",
    title: "Agendar reunião com equipe de vendas",
    description: "",
    deadline: "2026-07-03",
    status: "pending",
    createdAt: "2026-07-01",
  },
  {
    id: "4",
    title: "Implementar dashboard de métricas",
    description:
      "Criar visualização de KPIs principais: receita, churn e NPS. Integrar com dados do Supabase.",
    deadline: "2026-07-15",
    status: "in_progress",
    createdAt: "2026-06-20",
  },
  {
    id: "5",
    title: "Revisar contratos de fornecedores",
    description: "Verificar cláusulas de renovação e prazos de entrega dos três principais parceiros.",
    deadline: "2026-07-10",
    status: "in_progress",
    createdAt: "2026-06-25",
  },
  {
    id: "6",
    title: "Configurar integração n8n",
    description: "Conectar agente de IA com views do Supabase e testar fluxo de respostas.",
    deadline: "2026-06-25",
    status: "completed",
    createdAt: "2026-06-10",
  },
  {
    id: "7",
    title: "Definir estrutura de colaboradores",
    description: "Mapear papéis, permissões e fluxo de convite para a plataforma.",
    deadline: "2026-06-20",
    status: "completed",
    createdAt: "2026-06-05",
  },
];

const COLUMN_ICONS: Record<TaskStatus, typeof Circle> = {
  pending: CircleDashed,
  in_progress: Circle,
  completed: CircleCheck,
};

const COLUMN_HINTS: Record<TaskStatus, string> = {
  pending: "Aguardando início",
  in_progress: "Em andamento",
  completed: "Concluídas",
};

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export function TasksBoard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  function handleCreate(data: NewTaskData) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      status: "pending",
      createdAt: formatDate(new Date()),
    };
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleStatusChange(taskId: string, status: TaskStatus) {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status } : task)),
    );
    setSelectedTask((prev) => (prev?.id === taskId ? { ...prev, status } : prev));
  }

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <>
      <div className="flex h-full flex-col gap-6">
        <div className="flex shrink-0 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground text-sm">
              {totalTasks} {totalTasks === 1 ? "tarefa" : "tarefas"}
              {completedCount > 0 && (
                <span className="text-muted-foreground/70">
                  {" "}
                  · {completedCount} finalizada{completedCount !== 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <Plus className="size-4" />
            Nova tarefa
          </button>
        </div>

        <div className="border-border bg-muted/30 shrink-0 rounded-xl border px-4 py-3">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {TASK_STATUS_ORDER.map((status, index) => {
              const Icon = COLUMN_ICONS[status];
              const count = tasks.filter((t) => t.status === status).length;

              return (
                <div key={status} className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <Icon className="text-muted-foreground size-4 shrink-0" />
                    <span className="text-foreground hidden text-sm font-medium sm:inline">
                      {TASK_STATUS_LABELS[status]}
                    </span>
                    <span className="bg-background text-muted-foreground rounded-md px-1.5 py-0.5 text-xs tabular-nums">
                      {count}
                    </span>
                  </div>
                  {index < TASK_STATUS_ORDER.length - 1 && (
                    <ArrowRight className="text-muted-foreground/40 size-4 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-3">
          {TASK_STATUS_ORDER.map((status) => {
            const columnTasks = tasks.filter((t) => t.status === status);
            const Icon = COLUMN_ICONS[status];

            return (
              <div
                key={status}
                className="border-border bg-muted/20 flex min-h-[320px] flex-col rounded-xl border md:min-h-0"
              >
                <div className="border-border flex items-center gap-2.5 border-b px-4 py-3">
                  <Icon className="text-muted-foreground size-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-foreground text-sm font-medium">
                      {TASK_STATUS_LABELS[status]}
                    </h2>
                    <p className="text-muted-foreground text-xs">{COLUMN_HINTS[status]}</p>
                  </div>
                  <span className="text-muted-foreground bg-background rounded-md px-2 py-0.5 text-xs tabular-nums">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto p-3">
                  {columnTasks.length === 0 ? (
                    <div className="border-border flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center">
                      <Icon className="text-muted-foreground/50 size-8" />
                      <p className="text-muted-foreground text-xs">
                        Nenhuma tarefa {status === "pending" ? "pendente" : status === "in_progress" ? "em progresso" : "finalizada"}
                      </p>
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onClick={() => setSelectedTask(task)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />

      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
