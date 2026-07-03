"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { AutoResizeTextarea } from "./auto-resize-textarea";
import type { NewCategoryData } from "./types";

type KnowledgeCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewCategoryData) => void;
};

export function KnowledgeCategoryModal({
  isOpen,
  onClose,
  onSave,
}: KnowledgeCategoryModalProps) {
  const titleId = useId();
  const descriptionId = useId();
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

    if (!title) return;

    onSave({ title, description });
    event.currentTarget.reset();
    onClose();
  }

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
              Nova categoria
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Adicione um novo contexto ao cérebro da empresa.
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
            <label htmlFor="category-title" className="text-foreground text-sm font-medium">
              Título
            </label>
            <input
              ref={titleRef}
              id="category-title"
              name="title"
              type="text"
              required
              placeholder="Ex: Fornecedores"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="category-description" className="text-foreground text-sm font-medium">
              Descrição
            </label>
            <AutoResizeTextarea
              id="category-description"
              name="description"
              rows={4}
              placeholder="Descreva o tipo de informação desta categoria..."
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 resize-none w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
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
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
