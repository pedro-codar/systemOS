"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CollaboratorModal } from "./collaborator-modal";
import { CollaboratorsList } from "./collaborators-list";
import type { Collaborator, CollaboratorArea } from "./types";
import { useAppContext } from "@/context/app-context";
import { InviteNewUser } from "@/lib/lib-auth";

type CollaboratorsHubProps = {
  initialAreas: CollaboratorArea[];
  initialCollaborators: Collaborator[];
};

export function CollaboratorsHub({
  initialAreas,
  initialCollaborators,
}: CollaboratorsHubProps) {
  const router = useRouter();
  const [collaborators, setCollaborators] = useState(initialCollaborators);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { companyId } = useAppContext();

  useEffect(() => {
    setCollaborators(initialCollaborators);
  }, [initialCollaborators]);

  const handleInvite = async (name: string, email: string, areaId: string) => {
    await InviteNewUser(name, email, areaId);
    router.refresh();
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
        companyId={companyId ?? ""}
      />
    </>
  );
}
