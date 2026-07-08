"use client";

import type { NewCategoryData } from "@/components/knowledge/types";
import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type KnowledgeCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewCategoryData) => Promise<void>;
};

export function KnowledgeCategoryModal({
  isOpen,
  onClose,
  onSave,
}: KnowledgeCategoryModalProps) {
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
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
    if (!isOpen) return;

    nameRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!name || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onSave({ name, description });
      form.reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
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
            <label htmlFor="category-name" className="text-foreground text-sm font-medium">
              Nome
            </label>
            <input
              ref={nameRef}
              id="category-name"
              name="name"
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
            <textarea
              ref={descriptionRef}
              id="category-description"
              name="description"
              rows={4}
              placeholder="Descreva o tipo de informação desta categoria..."
              onInput={resizeDescriptionField}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 resize-none w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
            />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg shadow-primary/20 transition-colors"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
