export type TaskStatus = "pending" | "in_progress" | "completed";

export type Task = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: TaskStatus;
  createdAt: string;
};

export type NewTaskData = {
  title: string;
  description: string;
  deadline: string;
};

export const TASK_STATUS_ORDER: TaskStatus[] = ["pending", "in_progress", "completed"];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pendente",
  in_progress: "Em progresso",
  completed: "Finalizado",
};
