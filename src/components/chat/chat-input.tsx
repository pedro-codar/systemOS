"use client";

import { ArrowUp, Mic } from "lucide-react";
import { useRef, useState } from "react";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // auto resize
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <div className="pb-4">
      <div className="bg-sidebar border-border mx-auto max-w-3xl rounded-3xl border">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          placeholder="Escreva uma mensagem..."
          rows={1}
          className="text-foreground placeholder:text-muted-foreground max-h-[400px] w-full resize-none bg-transparent px-4 pt-4 text-[18px] outline-none overflow-y-auto"
        />
        <div className="flex items-center justify-end px-3 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Voice input"
              className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors"
            >
              <Mic className="text-foreground size-[20px]" />
            </button>
            <button
              type="button"
              aria-label="Send message"
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}