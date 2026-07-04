"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { CollaboratorModal } from "./collaborator-modal";
import { CollaboratorsList } from "./collaborators-list";
import type { Collaborator, CollaboratorArea } from "./types";
import { useAppContext } from "@/context/app-context"
import { InviteNewUser } from "@/lib/lib-auth";
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

type CollaboratorsHubProps = {
  initialAreas: CollaboratorArea[];
};

export function CollaboratorsHub({ initialAreas }: CollaboratorsHubProps) {
  const [collaborators, setCollaborators] = useState(INITIAL_COLLABORATORS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { companyId } = useAppContext()

  const handleInvite = async (name: string, email: string, areaId: string) => {
    await InviteNewUser(name, email, areaId);
  };

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
        initialAreas={initialAreas}
        companyId={String(companyId)}
      />
    </>
  );
}
