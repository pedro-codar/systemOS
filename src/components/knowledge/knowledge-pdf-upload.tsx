"use client";

import { FileText, FileUp, Trash2, Upload } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type KnowledgePdfUploadProps = {
  fileName?: string | null;
  isUploading?: boolean;
  onFileChange?: (file: File | null) => void;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function KnowledgePdfUpload({
  fileName = null,
  isUploading = false,
  onFileChange,
}: KnowledgePdfUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [fileName]);

  const displayName = selectedFile?.name ?? fileName;
  const hasFile = Boolean(displayName);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") return;
    setSelectedFile(file);
    onFileChange?.(file);
  }

  function clearFile() {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
    onFileChange?.(null);
  }

  return (
    <div className="border-border bg-background flex h-full min-h-0 flex-col overflow-hidden rounded-xl border">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        disabled={isUploading}
        onChange={(event) => handleFiles(event.target.files)}
      />

      {hasFile ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 p-8">
          <div className="bg-primary/10 text-primary ring-primary/20 flex size-14 items-center justify-center rounded-2xl ring-1">
            <FileText className="size-6" />
          </div>

          <div className="max-w-md text-center">
            <p className="text-foreground text-base font-semibold tracking-tight">
              {displayName}
            </p>
            {selectedFile && (
              <p className="text-muted-foreground mt-1 text-sm">
                {formatFileSize(selectedFile.size)} · PDF
              </p>
            )}
            {!selectedFile && fileName && (
              <p className="text-muted-foreground mt-1 text-sm">Documento PDF</p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="border-border bg-popover text-foreground hover:border-primary/40 hover:bg-muted flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
            >
              <Upload className="size-4" />
              Trocar arquivo
            </button>
            {selectedFile && (
              <button
                type="button"
                onClick={clearFile}
                disabled={isUploading}
                className="text-destructive hover:bg-destructive/10 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
              >
                <Trash2 className="size-4" />
                Remover
              </button>
            )}
          </div>
        </div>
      ) : (
        <label
          htmlFor={isUploading ? undefined : inputId}
          onDragEnter={(event) => {
            event.preventDefault();
            if (!isUploading) setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!isUploading) setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            if (!isUploading) handleFiles(event.dataTransfer.files);
          }}
          className={`flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center transition-colors ${
            isUploading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          } ${
            isDragging
              ? "border-primary/50 bg-primary/5"
              : "hover:bg-muted/30"
          }`}
        >
          <span
            className={`flex size-14 items-center justify-center rounded-2xl ring-1 transition-colors ${
              isDragging
                ? "bg-primary/15 text-primary ring-primary/25"
                : "bg-muted text-muted-foreground ring-border"
            }`}
          >
            <FileUp className="size-6" />
          </span>

          <div className="max-w-sm">
            <p className="text-foreground text-base font-semibold tracking-tight">
              Enviar documento PDF
            </p>
            <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
              Arraste e solte o arquivo aqui, ou clique para selecionar. Apenas
              arquivos PDF são aceitos.
            </p>
          </div>

          <span className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg shadow-primary/20 transition-colors">
            <Upload className="size-4" />
            Selecionar PDF
          </span>
        </label>
      )}
    </div>
  );
}
