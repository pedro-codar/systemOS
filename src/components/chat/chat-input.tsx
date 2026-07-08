"use client";

import { triggerChat } from "@/actions/chat";
import { CreateChatMessage } from "@/lib/lib-chat-message";
import { ArrowUp, Mic } from "lucide-react";
import { useRef, useState } from "react";

type ChatInputProps = {
  conversationId: string;
  isAgentResponding: boolean;
  onMessageSent: () => Promise<void>;
  onAgentRequestStart: () => void;
  onAgentRequestFailed: () => void;
};

export function ChatInput({
  conversationId,
  isAgentResponding,
  onMessageSent,
  onAgentRequestStart,
  onAgentRequestFailed,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDisabled = sending || isAgentResponding;

  const resetTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || isDisabled) return;

    setSending(true);

    const { error } = await CreateChatMessage(conversationId, trimmed);

    if (error) {
      setSending(false);
      return;
    }

    setMessage("");
    resetTextareaHeight();
    await onMessageSent();
    onAgentRequestStart();

    const result = await triggerChat(Number(conversationId), trimmed);

    if (result?.error) {
      onAgentRequestFailed();
    }

    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isDisabled) return;
      void handleSend();
    }
  };

  return (
    <div className="pb-4">
      <div className="bg-sidebar border-border mx-auto max-w-3xl rounded-3xl border">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            isAgentResponding
              ? "Aguardando resposta do assistente..."
              : "Escreva uma mensagem..."
          }
          rows={1}
          disabled={isDisabled}
          className="text-foreground placeholder:text-muted-foreground max-h-[400px] w-full resize-none overflow-y-auto bg-transparent px-4 pt-4 text-[18px] outline-none disabled:opacity-60"
        />
        <div className="flex items-center justify-end px-3 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Entrada de voz"
              disabled={isDisabled}
              className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors disabled:opacity-50"
            >
              <Mic className="text-foreground size-[20px]" />
            </button>
            <button
              type="button"
              aria-label="Enviar mensagem"
              onClick={() => void handleSend()}
              disabled={isDisabled || !message.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
