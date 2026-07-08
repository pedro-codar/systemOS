"use client";

import { Calendar, ChevronRight } from "lucide-react";
import type { Task } from "./types";
import { isDeadlineOverdue, isDeadlineSoon, formatDeadline } from "./utils";

type TaskCardProps = {
  task: Task;
  onClick: () => void;
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const overdue = task.status !== "completed" && isDeadlineOverdue(task.deadline);
  const soon = task.status !== "completed" && isDeadlineSoon(task.deadline);

  return (
    <button
      type="button"
      onClick={onClick}
      className="border-border bg-sidebar-border hover:border-foreground/20 group w-full rounded-xl border p-3 text-left transition-all hover:shadow-md sm:p-4"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-foreground line-clamp-2 text-sm font-medium leading-snug">
          {task.title}
        </h3>
        <ChevronRight className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 opacity-40 transition-all group-hover:opacity-100 sm:opacity-0" />
      </div>

      {task.description && (
        <p className="text-muted-foreground mb-3 line-clamp-2 text-xs leading-relaxed">
          {task.description}
        </p>
      )}

      <div
        className={`flex items-center gap-1.5 text-xs ${
          overdue
            ? "text-destructive"
            : soon
              ? "text-warning"
              : "text-muted-foreground"
        }`}
      >
        <Calendar className="size-3.5 shrink-0" />
        <span>{formatDeadline(task.deadline)}</span>
        {overdue && <span className="font-medium">· Atrasada</span>}
        {soon && !overdue && <span className="font-medium">· Em breve</span>}
      </div>
    </button>
  );
}
