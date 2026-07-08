import type { ChatMessage as ChatMessageType } from "@/lib/lib-chat-message";

type ChatMessageProps = {
  message: ChatMessageType;
};

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-muted text-foreground max-w-[85%] rounded-3xl px-4 py-2.5 text-[16px] leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <p className="text-foreground text-[16px] leading-relaxed whitespace-pre-wrap">
      {message.content}
    </p>
  );
}
