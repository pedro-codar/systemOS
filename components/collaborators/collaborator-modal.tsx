"use client";

import { CheckCircle2, Mail, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { NewCollaboratorData } from "./types";

type CollaboratorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: NewCollaboratorData) => void;
};

export function CollaboratorModal({
  isOpen,
  onClose,
  onInvite,
}: CollaboratorModalProps) {
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"form" | "success">("form");
  const [invitedEmail, setInvitedEmail] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setStep("form");
      setInvitedEmail("");
      return;
    }

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
    const email = String(formData.get("email") ?? "").trim();

    if (!name || !email) return;

    onInvite({ name, email });
    setInvitedEmail(email);
    setStep("success");
    event.currentTarget.reset();
  }

  function handleClose() {
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={handleClose}
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
              {step === "form" ? "Convidar colaborador" : "Convite enviado"}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {step === "form"
                ? "Preencha os dados para enviar o acesso à plataforma."
                : "O colaborador receberá as instruções por e-mail."}
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="collaborator-name" className="text-foreground text-sm font-medium">
                Nome
              </label>
              <input
                ref={nameRef}
                id="collaborator-name"
                name="name"
                type="text"
                required
                placeholder="Ex: Marina Costa"
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="collaborator-email" className="text-foreground text-sm font-medium">
                E-mail
              </label>
              <input
                id="collaborator-email"
                name="email"
                type="email"
                required
                placeholder="Ex: marina@empresa.com"
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:ring-2"
              />
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg shadow-primary/20 transition-colors"
              >
                Enviar convite
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="border-border bg-background flex flex-col items-center gap-4 rounded-xl border px-6 py-8 text-center">
              <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full">
                <CheckCircle2 className="size-7" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-foreground text-sm font-medium">
                  E-mail enviado com sucesso!
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Enviamos um e-mail para{" "}
                  <span className="text-foreground font-medium">{invitedEmail}</span>{" "}
                  com o acesso para o colaborador entrar na plataforma.
                </p>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Mail className="size-3.5" />
                <span>O convite expira em 7 dias</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg shadow-primary/20 transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
