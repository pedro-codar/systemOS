import { Users } from "lucide-react";
import { CollaboratorItem } from "./collaborator-item";
import type { Collaborator } from "./types";

type CollaboratorsListProps = {
  collaborators: Collaborator[];
};

export function CollaboratorsList({ collaborators }: CollaboratorsListProps) {
  if (collaborators.length === 0) {
    return (
      <div className="border-border/60 bg-popover/40 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
        <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
          <Users className="size-5" />
        </div>
        <div>
          <p className="text-foreground text-sm font-medium">Nenhum colaborador ainda</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Convide o primeiro membro da equipe para começar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {collaborators.map((collaborator) => (
        <li key={collaborator.id}>
          <CollaboratorItem collaborator={collaborator} />
        </li>
      ))}
    </ul>
  );
}
