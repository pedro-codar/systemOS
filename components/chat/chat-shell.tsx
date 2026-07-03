"use client";

import { Bell, FileText } from "lucide-react";
import { useState } from "react";
import { BriefingSidebar } from "@/components/chat/briefing-sidebar";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage, type ChatMessageData } from "@/components/chat/chat-message";
import { Sidebar } from "@/components/shared/sidebar";

type ChatShellProps = {
  messages: ChatMessageData[];
};

export function ChatShell({ messages }: ChatShellProps) {
  const [isBriefingOpen, setIsBriefingOpen] = useState(true);

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar activeItem="chat" />

      <div className="flex min-w-0 flex-1 overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-end gap-2 px-6 py-2">
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
            <button
              type="button"
              aria-label="Notificações"
              className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors"
            >
              <Bell className="size-5" />
            </button>
          </header>

          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            </div>

            <ChatInput />
          </div>
        </div>

        {isBriefingOpen && <BriefingSidebar onClose={() => setIsBriefingOpen(false)} />}
      </div>
    </div>
  );
}
