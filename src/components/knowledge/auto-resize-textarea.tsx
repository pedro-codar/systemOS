"use client";

import { useEffect, useRef, type TextareaHTMLAttributes } from "react";

type AutoResizeTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function AutoResizeTextarea({
  onInput,
  value,
  defaultValue,
  className,
  ...props
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function resizeTextarea() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  useEffect(() => {
    resizeTextarea();
  }, [value, defaultValue]);

  return (
    <textarea
      ref={textareaRef}
      {...props}
      value={value}
      defaultValue={defaultValue}
      onInput={(event) => {
        resizeTextarea();
        onInput?.(event);
      }}
      className={`overflow-hidden ${className ?? ""}`}
    />
  );
}
