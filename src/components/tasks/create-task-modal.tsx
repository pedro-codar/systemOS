"use client";

import { Loader2, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { AssigneeSelect } from "./assignee-select";
import type { NewTaskData, TaskAssignee } from "./types";

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: NewTaskData) => Promise<boolean>;
  assignees: TaskAssignee[];
  currentUserId: string;
  canSelectAssignee: boolean;
};

export function CreateTaskModal({
  isOpen,
  onClose,
  onCreate,
  assignees,
  currentUserId,
  canSelectAssignee,
}: CreateTaskModalProps) {
  const titleId = useId();
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [assignedTo, setAssignedTo] = useState(currentUserId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const descriptionMaxHeight = 200;

  function resizeDescriptionField() {
    const textarea = descriptionRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const nextHeight = Math.min(textarea.scrollHeight, descriptionMaxHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > descriptionMaxHeight ? "auto" : "hidden";
  }

  useEffect(() => {
    if (!isOpen) {
      setAssignedTo(currentUserId);
      setIsSubmitting(false);
      return;
    }

    titleRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, currentUserId, isSubmitting]);

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const deadline = String(formData.get("deadline") ?? "").trim();
    const assigneeId = canSelectAssignee
      ? String(formData.get("assignedTo") ?? "").trim()
      : currentUserId;

    if (!title || !deadline || !assigneeId) return;

    setIsSubmitting(true);
    const success = await onCreate({
      title,
      description,
      deadline,
      assignedTo: assigneeId,
    });
    setIsSubmitting(false);

    if (!success) return;

    form.reset();
    setAssignedTo(currentUserId);
    onClose();
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="border-border bg-popover relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-2xl border p-5 shadow-2xl sm:rounded-2xl sm:p-6"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-foreground text-lg font-semibold tracking-tight">
              Nova tarefa
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Adicione uma tarefa ao quadro. Ela começará como pendente.
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 rounded-lg p-2 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="task-title" className="text-foreground text-sm font-medium">
              Título
            </label>
            <input
              ref={titleRef}
              id="task-title"
              name="title"
              type="text"
              required
              disabled={isSubmitting}
              placeholder="Ex: Revisar proposta comercial"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 disabled:opacity-50 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="task-description" className="text-foreground text-sm font-medium">
              Descrição
            </label>
            <textarea
              ref={descriptionRef}
              id="task-description"
              name="description"
              rows={3}
              disabled={isSubmitting}
              placeholder="Descreva o que precisa ser feito..."
              onInput={resizeDescriptionField}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 min-h-[80px] w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2 disabled:opacity-50"
            />
          </div>

          {canSelectAssignee ? (
            <AssigneeSelect
              assignees={assignees}
              currentUserId={currentUserId}
              value={assignedTo}
              onChange={setAssignedTo}
              disabled={isSubmitting}
            />
          ) : (
            <input type="hidden" name="assignedTo" value={currentUserId} />
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="task-deadline" className="text-foreground text-sm font-medium">
              Prazo
            </label>
            <input
              id="task-deadline"
              name="deadline"
              type="date"
              required
              min={today}
              disabled={isSubmitting}
              className="border-border bg-background text-foreground focus:border-primary/50 focus:ring-primary/20 disabled:opacity-50 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2 [color-scheme:dark]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (canSelectAssignee && assignees.length === 0)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? "Criando..." : "Criar tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
