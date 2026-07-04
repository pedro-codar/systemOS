import { Clock, User } from "lucide-react";
import type { Collaborator } from "./types";

type CollaboratorItemProps = {
  collaborator: Collaborator;
};

function formatDate(date: Date) {
  return date.toLocaleDateString("pt-BR");
}

function getInitials(name: string | null, email: string | null) {
  const source = name?.trim() || email?.trim() || "?";
  return source
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function CollaboratorItem({ collaborator }: CollaboratorItemProps) {
  const displayName = collaborator.name?.trim() || "Colaborador";
  const displayEmail = collaborator.email?.trim() || "E-mail não informado";
  const isPending = !collaborator.email;

  return (
    <div className="border-border/80 bg-popover/75 relative flex items-center gap-4 rounded-xl border px-5 py-4 shadow-lg shadow-black/10 backdrop-blur-sm">
      <div className="bg-card text-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
        {collaborator.avatar_url ? (
          <User className="size-4" />
        ) : (
          getInitials(collaborator.name, collaborator.email)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-semibold">{displayName}</p>
        <p className="text-muted-foreground truncate text-sm">{displayEmail}</p>
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
          {isPending ? "Convite pendente" : "Ativo"}
        </span>
        <span className="text-muted-foreground text-xs">
          Convidado em {formatDate(collaborator.created_at)}
        </span>
      </div>
    </div>
  );
}
