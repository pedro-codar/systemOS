"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { CollaboratorModal } from "./collaborator-modal";
import { CollaboratorsList } from "./collaborators-list";
import type { Collaborator, NewCollaboratorData } from "./types";

const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: "1",
    name: "Marina Costa",
    email: "marina@focoyemlayout.com",
    status: "active",
    invitedAt: "12/06/2026",
  },
  {
    id: "2",
    name: "Lucas Almeida",
    email: "lucas@focoyemlayout.com",
    status: "active",
    invitedAt: "18/06/2026",
  },
  {
    id: "3",
    name: "Ana Ribeiro",
    email: "ana@focoyemlayout.com",
    status: "pending",
    invitedAt: "01/07/2026",
  },
];

function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR");
}

export function CollaboratorsHub() {
  const [collaborators, setCollaborators] = useState(INITIAL_COLLABORATORS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleInvite(data: NewCollaboratorData) {
    const newCollaborator: Collaborator = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      status: "pending",
      invitedAt: formatDate(new Date()),
    };

    setCollaborators((prev) => [newCollaborator, ...prev]);
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            {collaborators.length}{" "}
            {collaborators.length === 1 ? "colaborador" : "colaboradores"}
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg shadow-primary/20 transition-colors"
          >
            <Plus className="size-4" />
            Convidar colaborador
          </button>
        </div>

        <CollaboratorsList collaborators={collaborators} />
      </div>

      <CollaboratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvite={handleInvite}
      />
    </>
  );
}
