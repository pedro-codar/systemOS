"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { AutoResizeTextarea } from "@/components/knowledge/auto-resize-textarea";
import type { NewSkillData } from "./types";

type CreateSkillModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: NewSkillData) => void;
};

function normalizeTrigger(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function CreateSkillModal({ isOpen, onClose, onCreate }: CreateSkillModalProps) {
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const trigger = normalizeTrigger(String(formData.get("trigger") ?? ""));
    const prompt = String(formData.get("prompt") ?? "").trim();

    if (!name || !trigger || !prompt) return;

    onCreate({ name, trigger, prompt });
    event.currentTarget.reset();
    onClose();
  }

  function handleTriggerInput(event: React.FormEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const normalized = normalizeTrigger(input.value);
    if (input.value !== normalized) {
      input.value = normalized;
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
              Nova skill
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Defina uma habilidade que o assistente pode acionar no chat.
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
            <label htmlFor="skill-name" className="text-foreground text-sm font-medium">
              Nome
            </label>
            <input
              ref={nameRef}
              id="skill-name"
              name="name"
              type="text"
              required
              placeholder="Ex: Gerar relatório de vendas"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="skill-trigger" className="text-foreground text-sm font-medium">
              Gatilho
            </label>
            <p className="text-muted-foreground text-xs">
              O que o usuário digita no chat para acionar esta skill.
            </p>
            <div className="border-border bg-background focus-within:border-primary/50 focus-within:ring-primary/20 flex w-full items-center rounded-xl border px-4 py-3 transition-colors focus-within:ring-2">
              <span className="text-primary mr-1 shrink-0 text-sm font-medium">/</span>
              <input
                id="skill-trigger"
                name="trigger"
                type="text"
                required
                placeholder="relatorio-vendas"
                onInput={handleTriggerInput}
                className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="skill-prompt" className="text-foreground text-sm font-medium">
              Prompt
            </label>
            <p className="text-muted-foreground text-xs">
              Instruções completas que o assistente seguirá ao executar esta skill.
            </p>
            <AutoResizeTextarea
              id="skill-prompt"
              name="prompt"
              rows={6}
              required
              placeholder="Descreva passo a passo o que o assistente deve fazer quando esta skill for acionada..."
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 min-h-[140px] w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
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
              Criar skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
