import { CalendarView } from "@/components/calendar/calendar-view";
import { Sidebar } from "@/components/shared/sidebar";
import { Bell } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar activeItem="calendar" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 px-6 py-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-foreground text-lg font-semibold">Calendário</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Eventos, reuniões e compromissos da empresa.
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
          <CalendarView />
        </main>
      </div>
    </div>
  );
}
