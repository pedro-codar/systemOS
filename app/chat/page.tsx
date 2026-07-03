import { ChatShell } from "@/components/chat/chat-shell";
import type { ChatMessageData } from "@/components/chat/chat-message";

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
  return <ChatShell messages={mockMessages} />;
}
