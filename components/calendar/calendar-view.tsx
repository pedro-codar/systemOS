"use client";

import { CalendarDays, Clock, Plus, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { CreateEventModal } from "./create-event-modal";
import { EventCard } from "./event-card";
import { EventDetailModal } from "./event-detail-modal";
import type { CalendarEvent, EventFilter, NewEventData } from "./types";
import {
  formatEventDateLong,
  formatEventTime,
  isEventPast,
  isEventToday,
  parseEventDate,
  toDateKey,
} from "./utils";

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Reunião de alinhamento semanal",
    description:
      "Revisar metas da semana, bloqueios da equipe e prioridades para os próximos dias.",
    startsAt: "2026-07-03T10:00",
    createdAt: "2026-06-28",
  },
  {
    id: "2",
    title: "Apresentação comercial Q3",
    description: "Demonstração da plataforma para o cliente principal do trimestre.",
    startsAt: "2026-07-08T14:00",
    createdAt: "2026-06-30",
  },
  {
    id: "3",
    title: "Workshop de processos internos",
    description: "Mapear fluxos de onboarding e documentar melhorias no SystemOS.",
    startsAt: "2026-07-15T09:30",
    createdAt: "2026-07-01",
  },
  {
    id: "4",
    title: "Check-in com equipe de vendas",
    description: "Acompanhar pipeline, metas do mês e oportunidades em aberto.",
    startsAt: "2026-07-02T16:00",
    createdAt: "2026-07-02",
  },
];

const FILTER_OPTIONS: { id: EventFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "upcoming", label: "Próximos" },
  { id: "today", label: "Hoje" },
  { id: "past", label: "Passados" },
];

const EMPTY_MESSAGES: Record<EventFilter, string> = {
  all: "Nenhum evento cadastrado. Crie o primeiro compromisso da empresa.",
  upcoming: "Nenhum evento futuro. Use o botão acima para agendar algo novo.",
  today: "Nenhum evento para hoje. Aproveite para planejar a semana.",
  past: "Nenhum evento passado registrado ainda.",
};

function sortByDateAsc(events: CalendarEvent[]) {
  return [...events].sort(
    (a, b) => parseEventDate(a.startsAt).getTime() - parseEventDate(b.startsAt).getTime(),
  );
}

function sortByDateDesc(events: CalendarEvent[]) {
  return [...events].sort(
    (a, b) => parseEventDate(b.startsAt).getTime() - parseEventDate(a.startsAt).getTime(),
  );
}

export function CalendarView() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [filter, setFilter] = useState<EventFilter>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const upcomingCount = useMemo(
    () => events.filter((event) => !isEventPast(event.startsAt)).length,
    [events],
  );

  const todayCount = useMemo(
    () => events.filter((event) => isEventToday(event.startsAt)).length,
    [events],
  );

  const nextEvent = useMemo(() => {
    const now = Date.now();
    return sortByDateAsc(events.filter((event) => parseEventDate(event.startsAt).getTime() >= now))[0] ?? null;
  }, [events]);

  const filteredEvents = useMemo(() => {
    switch (filter) {
      case "upcoming":
        return sortByDateAsc(events.filter((event) => !isEventPast(event.startsAt)));
      case "today":
        return sortByDateAsc(events.filter((event) => isEventToday(event.startsAt)));
      case "past":
        return sortByDateDesc(events.filter((event) => isEventPast(event.startsAt)));
      default:
        return sortByDateAsc(events);
    }
  }, [events, filter]);

  function handleCreate(data: NewEventData) {
    const newEvent: CalendarEvent = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      startsAt: data.startsAt,
      createdAt: toDateKey(new Date()),
    };
    setEvents((prev) => [...prev, newEvent]);
  }

  return (
    <>
      <div className="flex h-full flex-col gap-5">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            {events.length} {events.length === 1 ? "evento" : "eventos"} no total
            {todayCount > 0 && (
              <span className="text-muted-foreground/70">
                {" "}
                · {todayCount} hoje
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg shadow-primary/20 transition-colors"
          >
            <Plus className="size-4" />
            Novo evento
          </button>
        </div>

        <div className="border-border bg-muted/20 flex shrink-0 flex-wrap items-center gap-2 rounded-xl border p-2">
          {FILTER_OPTIONS.map((option) => {
            const isActive = filter === option.id;
            const count =
              option.id === "all"
                ? events.length
                : option.id === "upcoming"
                  ? upcomingCount
                  : option.id === "today"
                    ? todayCount
                    : events.length - upcomingCount;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-popover text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-popover/60"
                }`}
              >
                {option.label}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs tabular-nums ${
                    isActive ? "bg-muted text-foreground" : "bg-background/60 text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="border-border flex h-full min-h-[280px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-center">
              <div className="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-full">
                <CalendarDays className="size-7" />
              </div>
              <div className="max-w-sm">
                <p className="text-foreground text-sm font-medium">Nenhum evento aqui</p>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {EMPTY_MESSAGES[filter]}
                </p>
              </div>
              {filter !== "past" && (
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 mt-1 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  <Plus className="size-4" />
                  Criar evento
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 pb-2 md:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />

      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  );
}
