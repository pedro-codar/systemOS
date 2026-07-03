import { TasksBoard } from "@/components/tasks/tasks-board";
import { Sidebar } from "@/components/shared/sidebar";
import { Bell } from "lucide-react";

export default function TasksPage() {
  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar activeItem="tasks" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 px-6 py-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-foreground text-lg font-semibold">Tarefas</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Organize e acompanhe o progresso das atividades da empresa.
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

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6">
          <TasksBoard />
        </main>
      </div>
    </div>
  );
}
