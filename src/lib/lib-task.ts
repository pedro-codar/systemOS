import type { NewTaskData, Task, TaskAssignee, TaskStatus, UpdateTaskData } from "@/components/tasks/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./supabase/client";

export type TaskRow = {
  id: number;
  created_at: string;
  company_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  completed_at: string | null;
  assigned_to: string;
  created_by: string;
  deadline: string | null;
};

type TaskAssigneeRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: TaskAssignee["role"];
};

function toDateOnly(iso: string | null) {
  if (!iso) return "";
  return iso.split("T")[0];
}

export function mapTask(row: TaskRow): Task {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description ?? "",
    deadline: toDateOnly(row.deadline),
    status: row.status,
    createdAt: toDateOnly(row.created_at),
    assignedTo: row.assigned_to,
    createdBy: row.created_by,
    completedAt: row.completed_at,
  };
}

function mapTaskAssignee(row: TaskAssigneeRow): TaskAssignee {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
  };
}

export function profileToTaskAssignee(profile: {
  id: string;
  name: string | null;
  email: string | null;
  role: TaskAssignee["role"];
}): TaskAssignee {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
  };
}

export function withCurrentUserAsAssignee(
  assignees: TaskAssignee[],
  currentUser: TaskAssignee | null,
) {
  if (!currentUser) return assignees;
  if (assignees.some((item) => item.id === currentUser.id)) return assignees;
  return [currentUser, ...assignees];
}

const TASK_SELECT =
  "id, created_at, company_id, title, description, status, completed_at, assigned_to, created_by, deadline";

export async function GetTasks(supabase: SupabaseClient, companyId: string | number) {
  const { data, error } = await supabase
    .from("task")
    .select(TASK_SELECT)
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  return {
    data: data?.map((row) => mapTask(row as TaskRow)) ?? null,
    error,
  };
}

export async function GetTaskAssignees(
  supabase: SupabaseClient,
  companyId: string | number,
  currentUserId?: string,
) {
  const [assigneesResult, currentUserResult] = await Promise.all([
    supabase
      .from("profile")
      .select("id, name, email, role")
      .eq("company_id", companyId)
      .in("role", ["admin", "collaborator"])
      .order("name", { ascending: true }),
    currentUserId
      ? supabase
          .from("profile")
          .select("id, name, email, role")
          .eq("id", currentUserId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const assignees =
    assigneesResult.data?.map((row) => mapTaskAssignee(row as TaskAssigneeRow)) ?? [];

  const currentUser = currentUserResult.data
    ? mapTaskAssignee(currentUserResult.data as TaskAssigneeRow)
    : null;

  return {
    data: withCurrentUserAsAssignee(assignees, currentUser),
    error: assigneesResult.error ?? currentUserResult.error,
  };
}

type CreateTaskParams = NewTaskData & {
  companyId: string | number;
  createdBy: string;
};

export async function CreateTask({
  title,
  description,
  deadline,
  assignedTo,
  companyId,
  createdBy,
}: CreateTaskParams) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("task")
    .insert({
      company_id: companyId,
      title,
      description: description || null,
      status: "pending",
      assigned_to: assignedTo,
      created_by: createdBy,
      deadline: deadline ? `${deadline}T23:59:59.000Z` : null,
    })
    .select(TASK_SELECT)
    .single();

  return {
    data: data ? mapTask(data as TaskRow) : null,
    error,
  };
}

export async function UpdateTask(
  taskId: string,
  data: UpdateTaskData,
  userId: string,
) {
  const supabase = createClient();

  const { data: task, error } = await supabase
    .from("task")
    .update({
      title: data.title,
      description: data.description || null,
      assigned_to: data.assignedTo,
      deadline: data.deadline ? `${data.deadline}T23:59:59.000Z` : null,
    })
    .eq("id", taskId)
    .eq("created_by", userId)
    .select(TASK_SELECT)
    .single();

  return {
    data: task ? mapTask(task as TaskRow) : null,
    error,
  };
}

export async function UpdateTaskStatus(
  taskId: string,
  status: TaskStatus,
  userId: string,
  isAdmin = false,
) {
  const supabase = createClient();

  if (!isAdmin) {
    const { data: existing, error: fetchError } = await supabase
      .from("task")
      .select("assigned_to")
      .eq("id", taskId)
      .maybeSingle();

    if (fetchError || !existing || existing.assigned_to !== userId) {
      return { data: null, error: fetchError ?? new Error("Not allowed") };
    }
  }

  const { data: task, error } = await supabase
    .from("task")
    .update({
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", taskId)
    .select(TASK_SELECT)
    .single();

  return {
    data: task ? mapTask(task as TaskRow) : null,
    error,
  };
}

export async function DeleteTask(taskId: string, userId: string, isAdmin: boolean) {
  const supabase = createClient();

  let query = supabase.from("task").delete().eq("id", taskId);

  if (!isAdmin) {
    query = query.eq("created_by", userId);
  }

  const { error } = await query;

  return { error };
}
