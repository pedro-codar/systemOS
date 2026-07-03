"use client";

import { Calendar, X } from "lucide-react";
import { useEffect, useId } from "react";
import type { CalendarEvent } from "./types";
import {
  EVENT_STATUS_LABELS,
  formatCreatedAt,
  formatFullDateTime,
  getEventStatus,
} from "./utils";

type EventDetailModalProps = {
  event: CalendarEvent | null;
  onClose: () => void;
};

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!event) return;

    function handleKeyDown(keyEvent: KeyboardEvent) {
      if (keyEvent.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [event, onClose]);

  if (!event) return null;

  const status = getEventStatus(event.startsAt);

  const badgeStyles = {
    today: "bg-primary/15 text-primary",
    soon: "bg-warning/15 text-warning",
    scheduled: "bg-primary/15 text-primary",
    past: "bg-muted text-muted-foreground",
  } as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="border-border bg-popover relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-medium ${badgeStyles[status]}`}
              >
                {EVENT_STATUS_LABELS[status]}
              </span>
            </div>
            <h2 id={titleId} className="text-foreground text-lg font-semibold tracking-tight">
              {event.title}
            </h2>
            <p className="text-muted-foreground mt-1 text-xs">
              Criado em {formatCreatedAt(event.createdAt)}
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border-border bg-background flex flex-col gap-3 rounded-xl border p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Calendar className="size-4" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                  Data e hora
                </p>
                <p className="text-foreground mt-0.5 text-sm capitalize">
                  {formatFullDateTime(event.startsAt)}
                </p>
              </div>
            </div>

          </div>

          {event.description ? (
            <div className="flex flex-col gap-2">
              <p className="text-foreground text-sm font-medium">Descrição</p>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              Nenhuma descrição adicionada para este evento.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
