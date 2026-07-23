import { Sidebar } from "@/components/shared/sidebar";
import { TasksBoard } from "@/components/tasks/tasks-board";
import type { Task, TaskAssignee } from "@/components/tasks/types";
import { GetTaskAssignees, GetTasks } from "@/lib/lib-task";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarefas",
};

export default async function TasksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialTasks: Task[] = [];
  let assignees: TaskAssignee[] = [];

  if (user) {
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

    if (companyId) {
      const [tasksResult, assigneesResult] = await Promise.all([
        GetTasks(supabase, companyId),
        GetTaskAssignees(supabase, companyId, user.id),
      ]);

      initialTasks = tasksResult.data ?? [];
      assignees = assigneesResult.data ?? [];
    }
  }

  return (
    <div className="bg-background flex h-dvh overflow-hidden">
      <Sidebar activeItem="tasks" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-start justify-between gap-4 px-4 pt-14 pb-3 sm:items-center sm:px-6 sm:py-4 sm:pt-4">
          <div className="min-w-0">
            <h1 className="text-foreground text-lg font-semibold">Tarefas</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Organize e acompanhe o progresso da equipe.
            </p>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 sm:px-6 sm:pb-6">
          <TasksBoard initialTasks={initialTasks} assignees={assignees} />
        </main>
      </div>
    </div>
  );
}
