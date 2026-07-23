"use client";

import type {
  KnowledgeContextFormat,
  NewCategoryData,
} from "@/components/knowledge/types";
import { FileText, FileUp, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type KnowledgeCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewCategoryData) => Promise<void>;
};

const CONTENT_SOURCE_OPTIONS: {
  id: KnowledgeContextFormat;
  title: string;
  description: string;
  icon: typeof FileText;
}[] = [
  {
    id: "text",
    title: "Texto",
    description:
      "Escreva ou cole o conteúdo diretamente no editor. Ideal para políticas internas, processos, FAQs e informações que você atualiza com frequência.",
    icon: FileText,
  },
  {
    id: "pdf",
    title: "Documento PDF",
    description:
      "Envie um arquivo PDF já pronto. Ideal para manuais, contratos, relatórios ou materiais que já existem prontos em outro formato.",
    icon: FileUp,
  },
];

export function KnowledgeCategoryModal({
  isOpen,
  onClose,
  onSave,
}: KnowledgeCategoryModalProps) {
  const titleId = useId();
  const contentSourceLabelId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentSource, setContentSource] = useState<KnowledgeContextFormat>("text");

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
    setContentSource("text");

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
      await onSave({ name, description, context_format: contentSource });
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
        className="border-border bg-popover relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl shadow-primary/10"
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

          <div className="flex flex-col gap-2">
            <p id={contentSourceLabelId} className="text-foreground text-sm font-medium">
              Tipo de conteúdo
            </p>
            <div
              role="radiogroup"
              aria-labelledby={contentSourceLabelId}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {CONTENT_SOURCE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = contentSource === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setContentSource(option.id)}
                    className={`group relative flex h-full flex-col gap-3 rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-primary/50 bg-primary/5 shadow-md shadow-primary/10 ring-1 ring-primary/30"
                        : "border-border bg-background hover:border-primary/35 hover:bg-muted/40"
                    }`}
                  >
                    <span
                      className={`flex size-9 items-center justify-center rounded-lg ring-1 transition-colors ${
                        isSelected
                          ? "bg-primary/15 text-primary ring-primary/25"
                          : "bg-muted text-muted-foreground ring-border group-hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <span className="text-foreground text-sm font-semibold tracking-tight">
                        {option.title}
                      </span>
                      <span className="text-muted-foreground text-xs leading-relaxed">
                        {option.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
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
