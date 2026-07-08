"use client";

import { FileText } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BriefingSidebar } from "@/components/chat/briefing-sidebar";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessagesList } from "@/components/chat/chat-messages-list";
import {
  GetChatMessagesBefore,
  GetChatMessagesRecent,
  mergeChatMessages,
  type ChatMessage,
} from "@/lib/lib-chat-message";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/shared/sidebar";

const AGENT_RESPONSE_TIMEOUT_MS = 60_000;

type ChatShellProps = {
  conversationId: string;
  initialMessages: ChatMessage[];
  initialHasMoreOlder: boolean;
  userName: string;
  userRole: "admin" | "collaborator";
};

export function ChatShell({
  conversationId,
  initialMessages,
  initialHasMoreOlder,
  userName,
  userRole,
}: ChatShellProps) {
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [hasMoreOlder, setHasMoreOlder] = useState(initialHasMoreOlder);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isAgentResponding, setIsAgentResponding] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);
  const agentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    function syncBriefingDefault(matches: boolean) {
      setIsBriefingOpen(matches);
    }

    syncBriefingDefault(mediaQuery.matches);

    function onChange(event: MediaQueryListEvent) {
      syncBriefingDefault(event.matches);
    }

    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  const clearAgentTimeout = useCallback(() => {
    if (agentTimeoutRef.current) {
      clearTimeout(agentTimeoutRef.current);
      agentTimeoutRef.current = null;
    }
  }, []);

  const endAgentResponse = useCallback(() => {
    clearAgentTimeout();
    setIsAgentResponding(false);
    setAgentError(null);
  }, [clearAgentTimeout]);

  const startAgentResponse = useCallback(() => {
    clearAgentTimeout();
    setAgentError(null);
    setIsAgentResponding(true);

    agentTimeoutRef.current = setTimeout(() => {
      setIsAgentResponding(false);
      setAgentError("Não foi possível obter resposta. Tente novamente.");
    }, AGENT_RESPONSE_TIMEOUT_MS);
  }, [clearAgentTimeout]);

  useEffect(() => {
    return () => clearAgentTimeout();
  }, [clearAgentTimeout]);

  const syncRecentMessages = useCallback(async () => {
    const supabase = createClient();
    const { data } = await GetChatMessagesRecent(supabase, conversationId);

    if (data) {
      setMessages((current) => mergeChatMessages(current, data));
    }
  }, [conversationId]);

  const loadOlderMessages = useCallback(async () => {
    if (isLoadingOlder || !hasMoreOlder) {
      return;
    }

    const oldestMessage = messages[0];
    if (!oldestMessage) {
      return;
    }

    setIsLoadingOlder(true);

    const supabase = createClient();
    const { data, hasMore, error } = await GetChatMessagesBefore(
      supabase,
      conversationId,
      oldestMessage.id,
    );

    if (!error && data) {
      setMessages((current) => mergeChatMessages(current, data));
      setHasMoreOlder(hasMore);
    }

    setIsLoadingOlder(false);
  }, [conversationId, hasMoreOlder, isLoadingOlder, messages]);

  return (
    <div className="bg-background flex h-dvh overflow-hidden">
      <Sidebar activeItem="chat" />

      <div className="flex min-w-0 flex-1 overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-end gap-2 px-4 py-2 pl-14 md:px-6 md:pl-6">
            <button
              type="button"
              aria-label={isBriefingOpen ? "Fechar briefing" : "Abrir briefing"}
              aria-pressed={isBriefingOpen}
              onClick={() => setIsBriefingOpen((prev) => !prev)}
              className={`rounded-lg p-2 transition-colors ${
                isBriefingOpen
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="size-5" />
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <ChatMessagesList
              conversationId={conversationId}
              messages={messages}
              setMessages={setMessages}
              onSyncMessages={syncRecentMessages}
              onLoadOlderMessages={loadOlderMessages}
              hasMoreOlder={hasMoreOlder}
              isLoadingOlder={isLoadingOlder}
              onAgentResponseReceived={endAgentResponse}
              isAgentResponding={isAgentResponding}
              agentError={agentError}
              userName={userName}
              userRole={userRole}
            />

            <ChatInput
              conversationId={conversationId}
              isAgentResponding={isAgentResponding}
              onMessageSent={syncRecentMessages}
              onAgentRequestStart={startAgentResponse}
              onAgentRequestFailed={endAgentResponse}
            />
          </div>
        </div>

        {isBriefingOpen && <BriefingSidebar onClose={() => setIsBriefingOpen(false)} />}
      </div>
    </div>
  );
}
