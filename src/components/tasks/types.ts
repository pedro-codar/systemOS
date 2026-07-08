export type TaskStatus = "pending" | "in_progress" | "completed";

export type TaskAssigneeRole = "admin" | "collaborator";

export type TaskAssignee = {
  id: string;
  name: string | null;
  email: string | null;
  role: TaskAssigneeRole;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: TaskStatus;
  createdAt: string;
  assignedTo: string;
  createdBy: string;
  completedAt: string | null;
};

export type NewTaskData = {
  title: string;
  description: string;
  deadline: string;
  assignedTo: string;
};

export type UpdateTaskData = {
  title: string;
  description: string;
  deadline: string;
  assignedTo: string;
};

export function canEditTaskInfo(task: Task, userId: string) {
  return task.createdBy === userId;
}

export function canEditTaskStatus(task: Task, userId: string, isAdmin = false) {
  if (isAdmin) return true;
  return task.assignedTo === userId;
}

export function canDeleteTask(task: Task, userId: string, isAdmin: boolean) {
  return isAdmin || task.createdBy === userId;
}

export const TASK_STATUS_ORDER: TaskStatus[] = ["pending", "in_progress", "completed"];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pendente",
  in_progress: "Em progresso",
  completed: "Finalizado",
};
