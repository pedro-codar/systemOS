"use client";

import { Calendar, ChevronRight, Clock } from "lucide-react";
import type { CalendarEvent } from "./types";
import {
  EVENT_STATUS_LABELS,
  formatEventDay,
  formatEventMonth,
  formatEventTime,
  formatEventWeekday,
  getEventStatus,
} from "./utils";

type EventCardProps = {
  event: CalendarEvent;
  onClick: () => void;
};

const STATUS_STYLES = {
  today: {
    card: "border-primary/30 bg-primary/5 hover:border-primary/50 hover:shadow-primary/10",
    badge: "bg-primary/15 text-primary",
    date: "bg-primary text-primary-foreground",
  },
  soon: {
    card: "border-warning/30 bg-warning/5 hover:border-warning/50 hover:shadow-warning/10",
    badge: "bg-warning/15 text-warning",
    date: "bg-warning text-warning-foreground",
  },
  scheduled: {
    card: "border-border bg-popover/60 hover:border-primary/30 hover:shadow-primary/5",
    badge: "bg-muted text-muted-foreground",
    date: "bg-muted text-foreground",
  },
  past: {
    card: "border-border/60 bg-muted/20 hover:border-border opacity-80",
    badge: "bg-muted/80 text-muted-foreground",
    date: "bg-muted/60 text-muted-foreground",
  },
} as const;

export function EventCard({ event, onClick }: EventCardProps) {
  const status = getEventStatus(event.startsAt);
  const styles = STATUS_STYLES[status];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full flex-col overflow-hidden rounded-xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${styles.card}`}
    >
      <span className="from-primary/40 via-foreground/10 to-primary/40 absolute inset-x-4 top-0 h-px bg-gradient-to-r opacity-60" />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={`flex size-14 shrink-0 flex-col items-center justify-center rounded-xl ${styles.date}`}
        >
          <span className="text-lg leading-none font-bold tabular-nums">
            {formatEventDay(event.startsAt)}
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide">
            {formatEventMonth(event.startsAt)}
          </span>
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles.badge}`}
            >
              {EVENT_STATUS_LABELS[status]}
            </span>
            <span className="text-muted-foreground text-[10px] font-medium uppercase">
              {formatEventWeekday(event.startsAt)}
            </span>
          </div>
          <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-sm font-semibold leading-snug transition-colors">
            {event.title}
          </h3>
        </div>

        <ChevronRight className="text-muted-foreground group-hover:text-foreground mt-1 size-4 shrink-0 opacity-0 transition-all group-hover:opacity-100" />
      </div>

      {event.description ? (
        <p className="text-muted-foreground mb-4 line-clamp-2 text-xs leading-relaxed">
          {event.description}
        </p>
      ) : (
        <p className="text-muted-foreground/60 mb-4 text-xs italic">Sem descrição</p>
      )}

      <div className="border-border/60 mt-auto flex items-center justify-between gap-2 border-t pt-3">
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Clock className="size-3.5 shrink-0" />
          <span className="tabular-nums">{formatEventTime(event.startsAt)}</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Calendar className="size-3.5 shrink-0" />
          <span className="truncate">{formatEventWeekday(event.startsAt)}</span>
        </div>
      </div>
    </button>
  );
}
