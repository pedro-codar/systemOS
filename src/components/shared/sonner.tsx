"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      position="top-right"
      theme="dark"
      expand={false}
      visibleToasts={3}
      gap={12}
      offset={16}
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group toast flex w-full max-w-[356px] items-center gap-3 rounded-lg border border-border bg-popover px-4 py-3 shadow-lg",
          title: "text-sm font-medium text-popover-foreground",
          description: "text-xs text-muted-foreground",
          actionButton:
            "rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          cancelButton:
            "rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
          closeButton:
            "rounded-md text-muted-foreground transition-colors hover:text-foreground",
          success:
            "border-l-[3px] border-l-success [&_[data-icon]]:text-success",
          error:
            "border-l-[3px] border-l-destructive [&_[data-icon]]:text-destructive",
          info: "border-l-[3px] border-l-info [&_[data-icon]]:text-info",
          warning:
            "border-l-[3px] border-l-warning [&_[data-icon]]:text-warning",
        },
      }}
      {...props}
    />
  );
}
