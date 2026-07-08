"use client";

import { Calendar, Check, ChevronRight, Loader2, Trash2, User, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { AssigneeSelect } from "./assignee-select";
import type { Task, TaskAssignee, TaskStatus, UpdateTaskData } from "./types";
import {
  TASK_STATUS_LABELS,
  TASK_STATUS_ORDER,
  canEditTaskInfo,
  canEditTaskStatus,
  canDeleteTask,
} from "./types";
import { formatFullDate, isDeadlineOverdue, isDeadlineSoon } from "./utils";

type TaskDetailModalProps = {
  task: Task | null;
  assignees: TaskAssignee[];
  currentUserId: string;
  canSelectAssignee: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onUpdateInfo: (taskId: string, data: UpdateTaskData) => Promise<boolean>;
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<boolean>;
  onDelete: (taskId: string) => Promise<boolean>;
};

function getAssigneeLabel(assignees: TaskAssignee[], assigneeId: string) {
  const assignee = assignees.find((item) => item.id === assigneeId);
  return assignee?.name || assignee?.email || "Não informado";
}

export function TaskDetailModal({
  task,
  assignees,
  currentUserId,
  canSelectAssignee,
  isAdmin,
  onClose,
  onUpdateInfo,
  onStatusChange,
  onDelete,
}: TaskDetailModalProps) {
  const titleId = useId();
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    if (!task) return;

    setTitle(task.title);
    setDescription(task.description);
    setDeadline(task.deadline);
    setAssignedTo(task.assignedTo);
    setShowDeleteConfirm(false);
    resizeDescriptionField();
  }, [task]);

  useEffect(() => {
    resizeDescriptionField();
  }, [description]);

  useEffect(() => {
    if (!task) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSavingInfo && !isSavingStatus && !isDeleting) {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
          return;
        }
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [task, onClose, isSavingInfo, isSavingStatus, isDeleting, showDeleteConfirm]);

  if (!task) return null;

  const currentTask = task;
  const canEditInfo = canEditTaskInfo(currentTask, currentUserId);
  const canEditStatus = canEditTaskStatus(currentTask, currentUserId);
  const canDelete = canDeleteTask(currentTask, currentUserId, isAdmin);
  const overdue =
    currentTask.status !== "completed" && isDeadlineOverdue(currentTask.deadline);
  const soon = currentTask.status !== "completed" && isDeadlineSoon(currentTask.deadline);

  async function handleSaveInfo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canEditInfo) return;

    setIsSavingInfo(true);
    await onUpdateInfo(currentTask.id, {
      title: title.trim(),
      description: description.trim(),
      deadline,
      assignedTo: canSelectAssignee ? assignedTo : currentTask.assignedTo,
    });
    setIsSavingInfo(false);
  }

  async function handleStatusClick(status: TaskStatus) {
    if (!canEditStatus || status === currentTask.status || isSavingStatus) return;

    setIsSavingStatus(true);
    await onStatusChange(currentTask.id, status);
    setIsSavingStatus(false);
  }

  async function handleDelete() {
    if (!canDelete || isDeleting) return;

    setIsDeleting(true);
    const success = await onDelete(currentTask.id);
    setIsDeleting(false);

    if (success) {
      onClose();
    }
  }

  const isBusy = isSavingInfo || isSavingStatus || isDeleting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={() => !isBusy && !showDeleteConfirm && onClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="border-border bg-popover relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {canEditInfo ? (
              <>
                <h2 id={titleId} className="text-foreground text-lg font-semibold tracking-tight">
                  Editar tarefa
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Criada em {formatFullDate(currentTask.createdAt)}
                </p>
              </>
            ) : (
              <>
                <h2 id={titleId} className="text-foreground text-lg font-semibold tracking-tight">
                  {currentTask.title}
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  Criada em {formatFullDate(currentTask.createdAt)}
                </p>
              </>
            )}
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            disabled={isBusy}
            className="text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 shrink-0 rounded-lg p-2 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {canEditInfo ? (
            <form onSubmit={handleSaveInfo} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-task-title" className="text-foreground text-sm font-medium">
                  Título
                </label>
                <input
                  id="edit-task-title"
                  type="text"
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={isSavingInfo}
                  className="border-border bg-background text-foreground focus:border-primary/50 focus:ring-primary/20 disabled:opacity-50 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="edit-task-description"
                  className="text-foreground text-sm font-medium"
                >
                  Descrição
                </label>
                <textarea
                  ref={descriptionRef}
                  id="edit-task-description"
                  rows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  onInput={resizeDescriptionField}
                  disabled={isSavingInfo}
                  placeholder="Descreva o que precisa ser feito..."
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 min-h-[80px] w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2 disabled:opacity-50"
                />
              </div>

              {canSelectAssignee ? (
                <AssigneeSelect
                  assignees={assignees}
                  currentUserId={currentUserId}
                  value={assignedTo}
                  onChange={setAssignedTo}
                  disabled={isSavingInfo}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                    Responsável
                  </span>
                  <div className="text-foreground flex items-center gap-2 text-sm">
                    <User className="size-4 shrink-0" />
                    <span>{getAssigneeLabel(assignees, currentTask.assignedTo)}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="edit-task-deadline" className="text-foreground text-sm font-medium">
                  Prazo
                </label>
                <input
                  id="edit-task-deadline"
                  type="date"
                  required
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  disabled={isSavingInfo}
                  className="border-border bg-background text-foreground focus:border-primary/50 focus:ring-primary/20 disabled:opacity-50 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2 [color-scheme:dark]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingInfo || !title.trim() || !deadline || !assignedTo}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  {isSavingInfo && <Loader2 className="size-4 animate-spin" />}
                  {isSavingInfo ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          ) : (
            <>
              {currentTask.description ? (
                <div className="flex flex-col gap-2">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                    Descrição
                  </span>
                  <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                    {currentTask.description}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">Sem descrição.</p>
              )}

              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  Responsável
                </span>
                <div className="text-foreground flex items-center gap-2 text-sm">
                  <User className="size-4 shrink-0" />
                  <span>{getAssigneeLabel(assignees, currentTask.assignedTo)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  Prazo
                </span>
                <div
                  className={`flex items-center gap-2 text-sm ${
                    overdue
                      ? "text-destructive"
                      : soon
                        ? "text-warning"
                        : "text-foreground"
                  }`}
                >
                  <Calendar className="size-4 shrink-0" />
                  <span>{formatFullDate(currentTask.deadline)}</span>
                  {overdue && (
                    <span className="bg-destructive/10 text-destructive rounded-md px-2 py-0.5 text-xs font-medium">
                      Atrasada
                    </span>
                  )}
                  {soon && !overdue && (
                    <span className="bg-warning/10 text-warning rounded-md px-2 py-0.5 text-xs font-medium">
                      Em breve
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-3">
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Status
            </span>

            {canEditStatus ? (
              <>
                <div className="border-border bg-background flex items-center justify-center gap-1 rounded-xl border p-1.5">
                  {TASK_STATUS_ORDER.map((status, index) => {
                    const isActive = currentTask.status === status;
                    const isPast = TASK_STATUS_ORDER.indexOf(currentTask.status) > index;

                    return (
                      <div key={status} className="flex flex-1 items-center">
                        <button
                          type="button"
                          onClick={() => handleStatusClick(status)}
                          disabled={isSavingStatus}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-medium transition-all disabled:opacity-50 sm:px-3 sm:text-sm ${
                            isActive
                              ? "bg-foreground text-background shadow-sm"
                              : isPast
                                ? "text-foreground/70 hover:bg-muted"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {isSavingStatus && isActive ? (
                            <Loader2 className="size-3.5 shrink-0 animate-spin" />
                          ) : (
                            isPast && !isActive && <Check className="size-3.5 shrink-0" />
                          )}
                          <span className="truncate">{TASK_STATUS_LABELS[status]}</span>
                        </button>
                        {index < TASK_STATUS_ORDER.length - 1 && (
                          <ChevronRight className="text-muted-foreground/40 mx-0.5 size-3.5 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Você é o responsável e pode atualizar o status desta tarefa.
                </p>
              </>
            ) : (
              <>
                <div className="border-border bg-background flex items-center gap-2 rounded-xl border px-4 py-3">
                  <span className="text-foreground text-sm font-medium">
                    {TASK_STATUS_LABELS[currentTask.status]}
                  </span>
                </div>
                {!canEditInfo && (
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Apenas o responsável pode alterar o status.
                  </p>
                )}
              </>
            )}
          </div>

          {canDelete && (
            <div className="border-border border-t pt-4">
              {showDeleteConfirm ? (
                <div className="flex flex-col gap-3">
                  <p className="text-foreground text-sm">
                    Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                    >
                      {isDeleting && <Loader2 className="size-4 animate-spin" />}
                      {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isBusy}
                  className="text-destructive hover:bg-destructive/10 disabled:opacity-50 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  <Trash2 className="size-4" />
                  Excluir tarefa
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
