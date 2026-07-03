"use client";

import { Calendar, Check, ChevronRight, X } from "lucide-react";
import { useEffect, useId } from "react";
import type { Task, TaskStatus } from "./types";
import { TASK_STATUS_LABELS, TASK_STATUS_ORDER } from "./types";
import { formatFullDate, isDeadlineOverdue, isDeadlineSoon } from "./utils";

type TaskDetailModalProps = {
  task: Task | null;
  onClose: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
};

export function TaskDetailModal({ task, onClose, onStatusChange }: TaskDetailModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!task) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [task, onClose]);

  if (!task) return null;

  const overdue = task.status !== "completed" && isDeadlineOverdue(task.deadline);
  const soon = task.status !== "completed" && isDeadlineSoon(task.deadline);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="border-border bg-popover relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-foreground text-lg font-semibold tracking-tight">
              {task.title}
            </h2>
            <p className="text-muted-foreground mt-1 text-xs">
              Criada em {formatFullDate(task.createdAt)}
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 rounded-lg p-2 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {task.description ? (
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Descrição
              </span>
              <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">Sem descrição.</p>
          )}

          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Prazo
            </span>
            <div
              className={`flex items-center gap-2 text-sm ${
                overdue
                  ? "text-destructive"
                  : soon
                    ? "text-warning"
                    : "text-foreground"
              }`}
            >
              <Calendar className="size-4 shrink-0" />
              <span>{formatFullDate(task.deadline)}</span>
              {overdue && (
                <span className="bg-destructive/10 text-destructive rounded-md px-2 py-0.5 text-xs font-medium">
                  Atrasada
                </span>
              )}
              {soon && !overdue && (
                <span className="bg-warning/10 text-warning rounded-md px-2 py-0.5 text-xs font-medium">
                  Em breve
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Status
            </span>

            <div className="border-border bg-background flex items-center justify-center gap-1 rounded-xl border p-1.5">
              {TASK_STATUS_ORDER.map((status, index) => {
                const isActive = task.status === status;
                const isPast =
                  TASK_STATUS_ORDER.indexOf(task.status) > index;

                return (
                  <div key={status} className="flex flex-1 items-center">
                    <button
                      type="button"
                      onClick={() => onStatusChange(task.id, status)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-medium transition-all sm:px-3 sm:text-sm ${
                        isActive
                          ? "bg-foreground text-background shadow-sm"
                          : isPast
                            ? "text-foreground/70 hover:bg-muted"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {isPast && !isActive && <Check className="size-3.5 shrink-0" />}
                      <span className="truncate">{TASK_STATUS_LABELS[status]}</span>
                    </button>
                    {index < TASK_STATUS_ORDER.length - 1 && (
                      <ChevronRight className="text-muted-foreground/40 mx-0.5 size-3.5 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed">
              As tarefas seguem o fluxo:{" "}
              <span className="text-foreground">Pendente</span>
              {" → "}
              <span className="text-foreground">Em progresso</span>
              {" → "}
              <span className="text-foreground">Finalizado</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
