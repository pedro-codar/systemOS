import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage, type ChatMessageData } from "@/components/chat/chat-message";
import { Sidebar } from "@/components/shared/sidebar";
import { Bell } from "lucide-react";

const mockMessages: ChatMessageData[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Olá! Sou o assistente do SystemOS. Tenho acesso ao contexto da Foco em Layout Inc. e posso ajudar com tarefas, colaboradores, documentos e decisões do dia a dia.\n\nComo posso ajudar hoje?",
    timestamp: "09:12",
  },
  {
    id: "2",
    role: "user",
    content: "Quais são as tarefas pendentes da equipe de design esta semana?",
    timestamp: "09:13",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Encontrei 4 tarefas pendentes para a equipe de design:\n\n- Revisar protótipo do dashboard — prazo: quinta-feira\n- Atualizar guia de componentes — prazo: sexta-feira\n- Validar fluxo de onboarding — aguardando feedback\n- Preparar apresentação para o cliente — prazo: segunda-feira\n\nQuer que eu priorize alguma delas ou atribua responsáveis?",
    timestamp: "09:13",
  },
  {
    id: "4",
    role: "user",
    content: "Prioriza a apresentação para o cliente e me mostra quem está disponível para ajudar.",
    timestamp: "09:15",
  },
  {
    id: "5",
    role: "assistant",
    content:
      "Priorizei a apresentação para o cliente como urgente.\n\nColaboradores disponíveis hoje:\n- Marina Costa — Designer Sênior\n- Lucas Almeida — Designer de Produto\n- Ana Ribeiro — Ilustradora\n\nPosso criar subtarefas e notificar a equipe agora.",
    timestamp: "09:15",
  },
];

export default function ChatPage() {
  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar activeItem="chat" />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end gap-4 px-6 py-2">
          <button
            type="button"
            aria-label="Notificações"
            className="text-muted-foreground hover:text-foreground relative rounded-lg p-2 transition-colors"
          >
            <Bell className="size-[20px]" />
          </button>
        </header>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
              {mockMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          </div>

          <ChatInput />
        </div>
      </div>
    </div>
  );
}
