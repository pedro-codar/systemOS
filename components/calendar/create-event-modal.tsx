"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { AutoResizeTextarea } from "@/components/knowledge/auto-resize-textarea";
import type { NewEventData } from "./types";

type CreateEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: NewEventData) => void;
};

export function CreateEventModal({
  isOpen,
  onClose,
  onCreate,
}: CreateEventModalProps) {
  const titleId = useId();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    titleRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const startsAt = String(formData.get("startsAt") ?? "").trim();

    if (!title || !startsAt) return;

    onCreate({ title, description, startsAt });
    event.currentTarget.reset();
    onClose();
  }

  const now = new Date();
  const minDateTime = `${now.toISOString().slice(0, 10)}T00:00`;

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
        className="border-border bg-popover relative w-full max-w-md rounded-2xl border p-6 shadow-2xl shadow-primary/10"
      >
        <span className="from-primary/40 via-foreground/20 to-primary/40 absolute inset-x-6 top-0 h-px bg-gradient-to-r" />

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-foreground text-lg font-semibold tracking-tight">
              Novo evento
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Agende reuniões, prazos e compromissos da empresa.
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="event-title" className="text-foreground text-sm font-medium">
              Título
            </label>
            <input
              ref={titleRef}
              id="event-title"
              name="title"
              type="text"
              required
              placeholder="Ex: Reunião de alinhamento semanal"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="event-description" className="text-foreground text-sm font-medium">
              Descrição
            </label>
            <AutoResizeTextarea
              id="event-description"
              name="description"
              rows={3}
              placeholder="Detalhes, participantes ou pauta do evento..."
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 min-h-[80px] w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="event-starts-at" className="text-foreground text-sm font-medium">
              Data e hora
            </label>
            <input
              id="event-starts-at"
              name="startsAt"
              type="datetime-local"
              required
              min={minDateTime}
              className="border-border bg-background text-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2 [color-scheme:dark]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg shadow-primary/20 transition-colors"
            >
              Criar evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
