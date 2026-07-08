type UserRole = "admin" | "collaborator";

type ChatEmptyStateProps = {
  userName: string;
  userRole: UserRole;
};

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

const welcomeMessages: Record<UserRole, string> = {
  admin:
    "Tenho acesso ao contexto completo da sua empresa e posso ajudar com tarefas, colaboradores, calendário e decisões do dia a dia.",
  collaborator:
    "Posso ajudar com suas tarefas, prazos e informações da sua área de trabalho.",
};

export function ChatEmptyState({ userName, userRole }: ChatEmptyStateProps) {
  const firstName = getFirstName(userName);

  return (
    <p className="text-foreground text-[16px] leading-relaxed whitespace-pre-wrap">
      {`Olá, ${firstName}! Sou o assistente do SystemOS. ${welcomeMessages[userRole]}\n\nComo posso ajudar hoje?`}
    </p>
  );
}
