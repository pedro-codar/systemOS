"use client";

import type { TaskAssignee } from "./types";

type AssigneeSelectProps = {
  assignees: TaskAssignee[];
  currentUserId: string;
  value: string;
  onChange: (assigneeId: string) => void;
  disabled?: boolean;
};

function getAssigneeLabel(assignee: TaskAssignee, currentUserId: string) {
  const displayName = assignee.name || assignee.email || "Sem nome";

  if (assignee.id === currentUserId) {
    return `Você — ${displayName}`;
  }

  if (assignee.role === "admin") {
    return `${displayName} · Administrador`;
  }

  return displayName;
}

function sortAssignees(assignees: TaskAssignee[], currentUserId: string) {
  return [...assignees].sort((a, b) => {
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    const nameA = (a.name || a.email || "").toLowerCase();
    const nameB = (b.name || b.email || "").toLowerCase();
    return nameA.localeCompare(nameB, "pt-BR");
  });
}

export function AssigneeSelect({
  assignees,
  currentUserId,
  value,
  onChange,
  disabled = false,
}: AssigneeSelectProps) {
  const sortedAssignees = sortAssignees(assignees, currentUserId);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="task-assignee" className="text-foreground text-sm font-medium">
        Responsável
      </label>
      <select
        id="task-assignee"
        name="assignedTo"
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || assignees.length === 0}
        className="border-border bg-background text-foreground focus:border-primary/50 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
      >
        {sortedAssignees.length === 0 ? (
          <option value="">Nenhum membro disponível</option>
        ) : (
          sortedAssignees.map((assignee) => (
            <option key={assignee.id} value={assignee.id}>
              {getAssigneeLabel(assignee, currentUserId)}
            </option>
          ))
        )}
      </select>
      <p className="text-muted-foreground text-xs">
        Selecione quem será responsável por executar esta tarefa.
      </p>
    </div>
  );
}
