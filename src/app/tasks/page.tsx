import { Sidebar } from "@/components/shared/sidebar";
import { TasksBoard } from "@/components/tasks/tasks-board";
import type { Task, TaskAssignee } from "@/components/tasks/types";
import { GetTaskAssignees, GetTasks } from "@/lib/lib-task";
import { createClient } from "@/lib/supabase/server";
import { Bell } from "lucide-react";

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
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar activeItem="tasks" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 px-6 py-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-foreground text-lg font-semibold">Tarefas</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Organize e acompanhe o progresso da equipe.
            </p>
          </div>
          <button
            type="button"
            aria-label="Notificações"
            className="text-muted-foreground hover:text-foreground relative rounded-lg p-2 transition-colors"
          >
            <Bell className="size-5" />
          </button>
        </header>

        <main className="flex flex-1 flex-col overflow-hidden px-6 pb-6">
          <TasksBoard initialTasks={initialTasks} assignees={assignees} />
        </main>
      </div>
    </div>
  );
}
