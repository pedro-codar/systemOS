"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Undo2,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";

type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  label: string;
  children: ReactNode;
};

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  label,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg p-2 transition-colors ${
        isActive
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

type KnowledgeRichTextEditorProps = {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
};

export function KnowledgeRichTextEditor({
  content,
  onChange,
  placeholder = "Escreva todas as informações desta categoria aqui...",
}: KnowledgeRichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "knowledge-editor-content prose prose-sm prose-invert max-w-none min-h-full px-5 py-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      onChange(activeEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();
    if (currentContent !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="border-border bg-background flex h-full min-h-0 flex-col overflow-hidden rounded-xl border">
      <div className="border-border flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
        <ToolbarButton
          label="Negrito"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Itálico"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Título"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Lista com marcadores"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Lista numerada"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>

        <div className="bg-border mx-1 h-5 w-px" />

        <ToolbarButton
          label="Desfazer"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Refazer"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo2 className="size-4" />
        </ToolbarButton>
      </div>

      <div className="knowledge-editor min-h-0 flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}
