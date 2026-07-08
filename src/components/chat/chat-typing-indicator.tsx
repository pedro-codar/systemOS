export function ChatTypingIndicator() {
  return (
    <div className="flex items-center gap-3" aria-live="polite" aria-label="Assistente está respondendo">
      <p className="text-muted-foreground text-[16px]">Analisando sua pergunta</p>
      <div className="flex items-center gap-1">
        <span className="bg-muted-foreground chat-typing-dot size-1.5 rounded-full" />
        <span className="bg-muted-foreground chat-typing-dot size-1.5 rounded-full" />
        <span className="bg-muted-foreground chat-typing-dot size-1.5 rounded-full" />
      </div>
    </div>
  );
}
