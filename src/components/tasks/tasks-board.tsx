"use client";

import { ArrowRight, Circle, CircleCheck, CircleDashed, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/context/app-context";
import { CreateTask, DeleteTask, UpdateTask, UpdateTaskStatus, profileToTaskAssignee, withCurrentUserAsAssignee } from "@/lib/lib-task";
import { CreateTaskModal } from "./create-task-modal";
import { TaskCard } from "./task-card";
import { TaskDetailModal } from "./task-detail-modal";
import type { NewTaskData, Task, TaskAssignee, TaskStatus, UpdateTaskData } from "./types";
import { TASK_STATUS_LABELS, TASK_STATUS_ORDER } from "./types";
import { useTasksRealtime } from "./use-tasks-realtime";
import { isCompletedInCurrentMonth } from "./utils";

function getColumnTasks(tasks: Task[], status: TaskStatus) {
  if (status !== "completed") {
    return tasks.filter((task) => task.status === status);
  }

  return tasks.filter(
    (task) => task.status === "completed" && isCompletedInCurrentMonth(task.completedAt),
  );
}

const COLUMN_ICONS: Record<TaskStatus, typeof Circle> = {
  pending: CircleDashed,
  in_progress: Circle,
  completed: CircleCheck,
};

const COLUMN_HINTS: Record<TaskStatus, string> = {
  pending: "Aguardando início",
  in_progress: "Em andamento",
  completed: "Concluídas neste mês",
};

type TasksBoardProps = {
  initialTasks: Task[];
  assignees: TaskAssignee[];
};

export function TasksBoard({ initialTasks, assignees }: TasksBoardProps) {
  const { companyId, profile, isAdmin } = useAppContext();
  const [tasks, setTasks] = useState(initialTasks);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleTaskInserted = useCallback((task: Task) => {
    setTasks((prev) => {
      if (prev.some((item) => item.id === task.id)) return prev;
      return [task, ...prev];
    });
  }, []);

  const handleTaskUpdated = useCallback((task: Task) => {
    setTasks((prev) => prev.map((item) => (item.id === task.id ? task : item)));
    setSelectedTask((prev) => (prev?.id === task.id ? task : prev));
  }, []);

  const handleTaskDeleted = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((item) => item.id !== taskId));
    setSelectedTask((prev) => (prev?.id === taskId ? null : prev));
  }, []);

  useTasksRealtime(companyId, {
    onTaskInserted: handleTaskInserted,
    onTaskUpdated: handleTaskUpdated,
    onTaskDeleted: handleTaskDeleted,
  });

  async function handleCreate(data: NewTaskData): Promise<boolean> {
    if (!companyId || !profile) {
      toast.error("Empresa não encontrada.");
      return false;
    }

    const { data: task, error } = await CreateTask({
      ...data,
      assignedTo: isAdmin ? data.assignedTo : profile.id,
      companyId,
      createdBy: profile.id,
    });

    if (error || !task) {
      toast.error("Não foi possível criar a tarefa.");
      return false;
    }

    setTasks((prev) => {
      if (prev.some((item) => item.id === task.id)) return prev;
      return [task, ...prev];
    });
    toast.success("Tarefa criada com sucesso.");
    return true;
  }

  async function handleUpdateInfo(taskId: string, data: UpdateTaskData): Promise<boolean> {
    if (!profile) {
      toast.error("Usuário não autenticado.");
      return false;
    }

    const { data: task, error } = await UpdateTask(taskId, data, profile.id);

    if (error || !task) {
      toast.error("Não foi possível atualizar a tarefa.");
      return false;
    }

    handleTaskUpdated(task);
    toast.success("Tarefa atualizada com sucesso.");
    return true;
  }

  async function handleStatusChange(taskId: string, status: TaskStatus): Promise<boolean> {
    if (!profile) {
      toast.error("Usuário não autenticado.");
      return false;
    }

    const { data: task, error } = await UpdateTaskStatus(taskId, status, profile.id, isAdmin);

    if (error || !task) {
      toast.error("Não foi possível atualizar o status.");
      return false;
    }

    handleTaskUpdated(task);
    toast.success("Status atualizado com sucesso.");
    return true;
  }

  async function handleDelete(taskId: string): Promise<boolean> {
    if (!profile) {
      toast.error("Usuário não autenticado.");
      return false;
    }

    const { error } = await DeleteTask(taskId, profile.id, isAdmin);

    if (error) {
      toast.error("Não foi possível excluir a tarefa.");
      return false;
    }

    handleTaskDeleted(taskId);
    toast.success("Tarefa excluída com sucesso.");
    return true;
  }

  const completedThisMonth = getColumnTasks(tasks, "completed");
  const totalTasks = tasks.filter((task) => task.status !== "completed").length + completedThisMonth.length;
  const completedCount = completedThisMonth.length;
  const currentUserId = profile?.id ?? "";
  const assigneeOptions = useMemo(
    () =>
      withCurrentUserAsAssignee(
        assignees,
        profile ? profileToTaskAssignee(profile) : null,
      ),
    [assignees, profile],
  );

  return (
    <>
      <div className="flex h-full min-h-0 flex-col gap-4 sm:gap-6">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <p className="text-muted-foreground min-w-0 truncate text-sm">
            {totalTasks} {totalTasks === 1 ? "tarefa" : "tarefas"}
            {completedCount > 0 && (
              <span className="text-muted-foreground/70">
                {" "}
                · {completedCount} finalizada{completedCount !== 1 ? "s" : ""}
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            disabled={!profile}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors sm:px-4"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nova tarefa</span>
            <span className="sm:hidden">Nova</span>
          </button>
        </div>

        <div className="border-border bg-muted/30 hidden shrink-0 rounded-xl border px-4 py-3 sm:block">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {TASK_STATUS_ORDER.map((status, index) => {
              const Icon = COLUMN_ICONS[status];
              const count = getColumnTasks(tasks, status).length;

              return (
                <div key={status} className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <Icon className="text-muted-foreground size-4 shrink-0" />
                    <span className="text-foreground text-sm font-medium">
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

        <div className="flex min-h-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden pb-1 md:grid md:snap-none md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0">
          {TASK_STATUS_ORDER.map((status) => {
            const columnTasks = getColumnTasks(tasks, status);
            const Icon = COLUMN_ICONS[status];

            return (
              <div
                key={status}
                className="border-border bg-muted/20 flex w-[min(85vw,20rem)] shrink-0 snap-center flex-col rounded-xl border md:h-full md:min-h-0 md:w-auto"
              >
                <div className="border-border flex items-center gap-2.5 border-b px-3 py-3 sm:px-4">
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
                    <div className="border-border flex min-h-[12rem] flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-center sm:p-6">
                      <Icon className="text-muted-foreground/50 size-8" />
                      <p className="text-muted-foreground text-xs">
                        Nenhuma tarefa{" "}
                        {status === "pending"
                          ? "pendente"
                          : status === "in_progress"
                            ? "em progresso"
                            : "finalizada neste mês"}
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
        assignees={assigneeOptions}
        currentUserId={currentUserId}
        canSelectAssignee={isAdmin}
      />

      <TaskDetailModal
        task={selectedTask}
        assignees={assigneeOptions}
        currentUserId={currentUserId}
        canSelectAssignee={isAdmin}
        isAdmin={isAdmin}
        onClose={() => setSelectedTask(null)}
        onUpdateInfo={handleUpdateInfo}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </>
  );
}
