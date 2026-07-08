import type { ChatMessage as ChatMessageType } from "@/lib/lib-chat-message";

type ChatMessageProps = {
  message: ChatMessageType;
};

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-muted text-foreground max-w-[90%] rounded-3xl px-3 py-2.5 text-[15px] leading-relaxed md:max-w-[85%] md:px-4 md:text-[16px]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <p className="text-foreground text-[15px] leading-relaxed whitespace-pre-wrap md:text-[16px]">
      {message.content}
    </p>
  );
}
