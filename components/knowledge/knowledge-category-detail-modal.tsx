"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { AutoResizeTextarea } from "./auto-resize-textarea";
import type { KnowledgeCardData, NewInformationData } from "./types";

type KnowledgeCategoryDetailModalProps = {
  category: KnowledgeCardData | null;
  onClose: () => void;
  onAddInformation: (categoryId: string, data: NewInformationData) => void;
  onDeleteInformation: (categoryId: string, informationId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
};

export function KnowledgeCategoryDetailModal({
  category,
  onClose,
  onAddInformation,
  onDeleteInformation,
  onDeleteCategory,
}: KnowledgeCategoryDetailModalProps) {
  const titleId = useId();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!category) return;

    setIsFormVisible(false);
    setIsConfirmingDelete(false);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [category, onClose]);

  useEffect(() => {
    if (isFormVisible) {
      titleRef.current?.focus();
    }
  }, [isFormVisible]);

  if (!category) return null;

  const categoryId = category.id;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!title) return;

    onAddInformation(categoryId, { title, description });
    event.currentTarget.reset();
    setIsFormVisible(false);
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
        className="border-border bg-popover relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl shadow-primary/10"
      >
        <span className="from-primary/40 via-foreground/20 to-primary/40 absolute inset-x-6 top-0 h-px bg-gradient-to-r" />

        <div className="border-border flex items-start justify-between gap-4 border-b px-6 py-5">
          <div className="min-w-0">
            <h2 id={titleId} className="text-foreground truncate text-xl font-semibold tracking-tight">
              {category.title}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">{category.description}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFormVisible(true)}
              className="border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
            >
              <Plus className="size-4" />
              Adicionar informação
            </button>
            <button
              type="button"
              aria-label="Fechar"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isFormVisible && (
            <form
              onSubmit={handleSubmit}
              className="border-primary/25 bg-background/60 mb-5 rounded-2xl border p-5"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="information-title" className="text-foreground text-sm font-medium">
                    Título
                  </label>
                  <input
                    ref={titleRef}
                    id="information-title"
                    name="title"
                    type="text"
                    required
                    placeholder="Ex: Gráfica Norte — fornecedor de papel"
                    className="border-border bg-popover text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="information-description"
                    className="text-foreground text-sm font-medium"
                  >
                    Descrição
                  </label>
                  <AutoResizeTextarea
                    id="information-description"
                    name="description"
                    rows={4}
                    placeholder="Contato, prazos, condições e demais detalhes..."
                    className="border-border bg-popover text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 resize-none w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormVisible(false)}
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
              </div>
            </form>
          )}

          {category.informations.length === 0 ? (
            <div className="border-border bg-background/40 flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center">
              <p className="text-foreground text-sm font-medium">Nenhuma informação ainda</p>
              <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                Clique em &quot;Adicionar informação&quot; para começar a preencher esta categoria.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {category.informations.map((information, index) => (
                <article
                  key={information.id}
                  className={`border-border bg-background/60 rounded-2xl border p-5 transition-colors ${
                    index === 0 ? "border-primary/35 shadow-primary/5 shadow-lg" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-foreground text-sm leading-relaxed font-semibold">
                      {information.title}
                    </h3>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        aria-label="Editar informação"
                        className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Excluir informação"
                        onClick={() => onDeleteInformation(category.id, information.id)}
                        className="text-muted-foreground hover:text-destructive rounded-lg p-2 transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  {information.description && (
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                      {information.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-border border-t px-6 py-4">
          {isConfirmingDelete ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-foreground text-sm">
                Excluir &quot;{category.title}&quot; e todas as informações desta categoria?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCategory(categoryId);
                    onClose();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  Sim, excluir
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="text-destructive hover:bg-destructive/10 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
              >
                <Trash2 className="size-4" />
                Excluir categoria
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
