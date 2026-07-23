"use client";

import { FileText, FileUp, Save, Trash2, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { KnowledgePdfUpload } from "./knowledge-pdf-upload";
import { KnowledgeRichTextEditor } from "./knowledge-rich-text-editor";
import type { KnowledgeCategory } from "./types";
import { getFileNameFromStoragePath } from "./types";

type KnowledgeCategoryDetailModalProps = {
  category: KnowledgeCategory | null;
  content: string;
  pdfUrl?: string | null;
  onClose: () => void;
  onSaveContent: (categoryId: string, content: string) => Promise<boolean>;
  onSavePdf: (categoryId: string, file: File) => Promise<boolean>;
  onDeleteCategory: (categoryId: string) => void;
};

export function KnowledgeCategoryDetailModal({
  category,
  content,
  pdfUrl = null,
  onClose,
  onSaveContent,
  onSavePdf,
  onDeleteCategory,
}: KnowledgeCategoryDetailModalProps) {
  const titleId = useId();
  const [draftContent, setDraftContent] = useState("");
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!category) return;

    setDraftContent(content);
    setSelectedPdf(null);
    setIsConfirmingDelete(false);
    setIsSaved(true);
  }, [category, content, pdfUrl]);

  if (!category) return null;

  const categoryId = category.id;
  const isPdfCategory = category.context_format === "pdf";
  const existingPdfName = getFileNameFromStoragePath(pdfUrl);
  const hasUnsavedChanges = isPdfCategory
    ? Boolean(selectedPdf)
    : draftContent !== content;

  function handleContentChange(nextContent: string) {
    setDraftContent(nextContent);
    setIsSaved(false);
  }

  function handlePdfChange(file: File | null) {
    setSelectedPdf(file);
    setIsSaved(!file);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      if (isPdfCategory) {
        if (!selectedPdf) return;
        const saved = await onSavePdf(categoryId, selectedPdf);
        if (saved) {
          setSelectedPdf(null);
          setIsSaved(true);
        }
        return;
      }

      const saved = await onSaveContent(categoryId, draftContent);
      if (saved) setIsSaved(true);
    } finally {
      setIsSaving(false);
    }
  }

  function handleClose() {
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        aria-hidden
        className="bg-background/80 pointer-events-none absolute inset-0 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="border-border bg-popover relative flex h-[min(92vh,880px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-2xl shadow-primary/10"
      >
        <span className="from-primary/40 via-foreground/20 to-primary/40 absolute inset-x-8 top-0 h-px bg-gradient-to-r" />

        <header className="border-border shrink-0 border-b px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="bg-primary/15 text-primary ring-primary/25 flex h-8 w-8 items-center justify-center rounded-lg ring-1">
                  {isPdfCategory ? (
                    <FileUp className="size-4" />
                  ) : (
                    <FileText className="size-4" />
                  )}
                </span>
                {!isSaved && (
                  <span className="bg-warning/15 text-warning rounded-full px-2.5 py-0.5 text-[11px] font-medium">
                    Alterações não salvas
                  </span>
                )}
                <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-[11px] font-medium">
                  {isPdfCategory ? "Documento PDF" : "Texto"}
                </span>
              </div>
              <h2
                id={titleId}
                className="text-foreground text-2xl font-semibold tracking-tight"
              >
                {category.name}
              </h2>
              <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm leading-relaxed">
                {category.description || "Sem descrição"}
              </p>
            </div>

            <button
              type="button"
              aria-label="Fechar"
              onClick={handleClose}
              disabled={isSaving}
              className="text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 rounded-lg p-2 transition-colors disabled:opacity-60"
            >
              <X className="size-5" />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col px-6 py-5 sm:px-8">
          <label className="text-foreground mb-2 block text-sm font-medium">
            {isPdfCategory ? "Documento da categoria" : "Informações da categoria"}
          </label>
          <div className="min-h-0 flex-1">
            {isPdfCategory ? (
              <KnowledgePdfUpload
                key={categoryId}
                fileName={existingPdfName}
                isUploading={isSaving}
                onFileChange={handlePdfChange}
              />
            ) : (
              <KnowledgeRichTextEditor
                key={categoryId}
                content={draftContent}
                onChange={handleContentChange}
              />
            )}
          </div>
        </div>

        <footer className="border-border shrink-0 border-t px-6 py-4 sm:px-8">
          {isConfirmingDelete ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-foreground text-sm">
                Excluir &quot;{category.name}&quot; e todo o conteúdo desta categoria?
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
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="text-destructive hover:bg-destructive/10 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors sm:justify-start"
              >
                <Trash2 className="size-4" />
                Excluir categoria
              </button>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || isSaving}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium shadow-lg shadow-primary/20 transition-colors disabled:cursor-not-allowed"
                >
                  <Save className="size-4" />
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
