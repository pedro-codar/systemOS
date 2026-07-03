import { Clock, User } from "lucide-react";
import type { Collaborator } from "./types";

type CollaboratorItemProps = {
  collaborator: Collaborator;
};

const statusLabels: Record<Collaborator["status"], string> = {
  active: "Ativo",
  pending: "Convite pendente",
};

export function CollaboratorItem({ collaborator }: CollaboratorItemProps) {
  const isPending = collaborator.status === "pending";

  return (
    <div className="border-border/80 bg-popover/75 relative flex items-center gap-4 rounded-xl border px-5 py-4 shadow-lg shadow-black/10 backdrop-blur-sm">
      <div className="bg-card text-foreground flex size-10 shrink-0 items-center justify-center rounded-full">
        <User className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-semibold">
          {collaborator.name}
        </p>
        <p className="text-muted-foreground truncate text-sm">{collaborator.email}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            isPending
              ? "bg-warning/15 text-warning"
              : "bg-primary/10 text-primary"
          }`}
        >
          {isPending && <Clock className="size-3" />}
          {statusLabels[collaborator.status]}
        </span>
        <span className="text-muted-foreground text-xs">
          Convidado em {collaborator.invitedAt}
        </span>
      </div>
    </div>
  );
}
