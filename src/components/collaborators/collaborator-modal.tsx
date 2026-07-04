"use client";

import { CreateCollaboratorArea } from "@/lib/lib-area";
import { CheckCircle2, Loader2, Mail, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { AreaSearchSelect } from "./area-search-select";
import type { CollaboratorArea } from "./types";

type NewCollaboratorData = {
  name: string;
  email: string;
  area: CollaboratorArea;
};

type CollaboratorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (name: string, email: string, areaId: string) => Promise<void>;
  initialAreas: CollaboratorArea[];
  companyId: string;
};

export function CollaboratorModal({
  isOpen,
  onClose,
  onInvite,
  initialAreas,
  companyId,
}: CollaboratorModalProps) {
  const titleId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"form" | "success">("form");
  const [invitedEmail, setInvitedEmail] = useState("");
  const [areas, setAreas] = useState(initialAreas);
  const [selectedArea, setSelectedArea] = useState<CollaboratorArea | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep("form");
      setInvitedEmail("");
      setSelectedArea(null);
      setIsSubmitting(false);
      return;
    }

    setAreas(initialAreas);
    nameRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, initialAreas]);

  if (!isOpen) return null;

  async function handleCreateArea(name: string) {
    if (!companyId) {
      toast.error("Empresa não encontrada.");
      return null;
    }

    const { data, error } = await CreateCollaboratorArea(name, companyId);

    if (error || !data) {
      toast.error("Não foi possível criar a área.");
      return null;
    }

    toast.success("Área criada com sucesso.")

    setAreas((prev) =>
      [...prev, data].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    );
    return data;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (!name || !email || !selectedArea || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onInvite(name, email, selectedArea.id);
      setInvitedEmail(email);
      setStep("success");
      formRef.current?.reset();
    } catch {
      toast.error("Erro ao convidar colaborador.");
    } finally {
      setIsSubmitting(false);
    }
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
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
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

            <AreaSearchSelect
              areas={areas}
              value={selectedArea}
              onChange={setSelectedArea}
              onCreateArea={handleCreateArea}
              disabled={!companyId}
            />

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!selectedArea || isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg shadow-primary/20 transition-colors"
              >
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {isSubmitting ? "Enviando..." : "Enviar convite"}
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
