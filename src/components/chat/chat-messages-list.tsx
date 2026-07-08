"use client";

import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatTypingIndicator } from "@/components/chat/chat-typing-indicator";
import {
  mapChatMessage,
  type ChatMessage as ChatMessageType,
  type ChatMessageRow,
} from "@/lib/lib-chat-message";
import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from "react";

type ChatMessagesListProps = {
  conversationId: string;
  messages: ChatMessageType[];
  setMessages: Dispatch<SetStateAction<ChatMessageType[]>>;
  onSyncMessages: () => Promise<void>;
  onLoadOlderMessages: () => Promise<void>;
  hasMoreOlder: boolean;
  isLoadingOlder: boolean;
  onAgentResponseReceived: () => void;
  isAgentResponding: boolean;
  agentError: string | null;
  userName: string;
  userRole: "admin" | "collaborator";
};

export function ChatMessagesList({
  conversationId,
  messages,
  setMessages,
  onSyncMessages,
  onLoadOlderMessages,
  hasMoreOlder,
  isLoadingOlder,
  onAgentResponseReceived,
  isAgentResponding,
  agentError,
  userName,
  userRole,
}: ChatMessagesListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldStickToBottomRef = useRef(true);
  const hasScrolledInitiallyRef = useRef(false);

  const onSyncMessagesRef = useRef(onSyncMessages);
  const onAgentResponseReceivedRef = useRef(onAgentResponseReceived);
  const onLoadOlderMessagesRef = useRef(onLoadOlderMessages);

  useEffect(() => {
    onSyncMessagesRef.current = onSyncMessages;
  }, [onSyncMessages]);

  useEffect(() => {
    onAgentResponseReceivedRef.current = onAgentResponseReceived;
  }, [onAgentResponseReceived]);

  useEffect(() => {
    onLoadOlderMessagesRef.current = onLoadOlderMessages;
  }, [onLoadOlderMessages]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    shouldStickToBottomRef.current = distanceFromBottom < 120;
  }, []);

  const loadOlderWithScrollPreservation = useCallback(async () => {
    const container = scrollContainerRef.current;
    if (!container || isLoadingOlder || !hasMoreOlder) return;

    const previousScrollHeight = container.scrollHeight;

    await onLoadOlderMessagesRef.current();

    requestAnimationFrame(() => {
      const nextContainer = scrollContainerRef.current;
      if (!nextContainer) return;

      nextContainer.scrollTop =
        nextContainer.scrollHeight - previousScrollHeight;
    });
  }, [hasMoreOlder, isLoadingOlder]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (!hasScrolledInitiallyRef.current) {
      bottomRef.current?.scrollIntoView();
      hasScrolledInitiallyRef.current = true;
      return;
    }

    if (shouldStickToBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAgentResponding, agentError]);

  useEffect(() => {
    const sentinel = topSentinelRef.current;
    const root = scrollContainerRef.current;

    if (!sentinel || !root || !hasMoreOlder) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadOlderWithScrollPreservation();
        }
      },
      { root, rootMargin: "120px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMoreOlder, loadOlderWithScrollPreservation]);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    async function setupRealtime() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !isMounted) return;

      const channel = supabase
        .channel(`chat_messages:${conversationId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_message",
            filter: `chat_conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            const message = mapChatMessage(payload.new as ChatMessageRow);

            if (message.role === "assistant") {
              onAgentResponseReceivedRef.current();
            }

            setMessages((current) => {
              if (current.some((item) => item.id === message.id)) {
                return current;
              }

              return [...current, message];
            });
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    let cleanup: (() => void) | undefined;

    void setupRealtime().then((removeChannel) => {
      cleanup = removeChannel;
    });

    return () => {
      isMounted = false;
      cleanup?.();
    };
  }, [conversationId, setMessages]);

  const showEmptyState =
    messages.length === 0 && !isAgentResponding && !agentError;

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-6 py-6"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        {showEmptyState ? (
          <ChatEmptyState userName={userName} userRole={userRole} />
        ) : (
          <>
            <div ref={topSentinelRef} className="h-px shrink-0" />
            {isLoadingOlder && (
              <p className="text-muted-foreground text-center text-sm">
                Carregando mensagens anteriores...
              </p>
            )}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isAgentResponding && <ChatTypingIndicator />}
            {agentError && (
              <p className="text-destructive text-sm">{agentError}</p>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
